const Config = require("./config");
const initDatabase = require("./db");

const Interval = 1500;

var amazonMws = require("amazon-mws")(
  Config.AWS_ACCESS_KEY_ID,
  Config.AWS_SECRET_ACCESS_KEY
);

function sleep (ms){
  return new Promise(resolve =>{
    setTimeout(resolve, ms)
  })
}

// Iterate through order list from amazon. Get orderItems information one by one and insert it to DB

async function putOrdersToDB(amzOrders, dbCollection) {
  let amzOrderItems = "";
  try {
    for (let anOrder of amzOrders) {
      anOrder._id = anOrder.AmazonOrderId;
      
      await sleep(5000);

      amzOrderItems = await amazonMws.orders.search({
        Version: "2013-09-01",
        Action: "ListOrderItems",
        SellerId: "A1LZN806TROZ37",
        MWSAuthToken: "AKIAIMZQGS4V5KCJOSVA",
        AmazonOrderId: anOrder.AmazonOrderId
      });
      console.log(amzOrderItems);
      let orderitems = amzOrderItems.OrderItems.OrderItem;
      let orderitemArray = [];
      if (!orderitems) {
        orderitemArray = [];
        console.log("warning - this should never happen, no orderitem for the order");
      } else {
        if (Array.isArray(orderitems)) {
          orderitemArray = orderitems;
        } else {
          orderitemArray = [orderitems];
        }
      }
      anOrder.orderItems = orderitemArray;
      await dbCollection.replaceOne({ _id: anOrder._id }, anOrder, {
        upsert: true
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function listOrders() {
  try {
    let amzResult = await amazonMws.orders.search({
      Version: "2013-09-01",
      Action: "ListOrders",
      SellerId: "A1LZN806TROZ37",
      MWSAuthToken: "AKIAIMZQGS4V5KCJOSVA",
      "MarketplaceId.Id.1": "ATVPDKIKX0DER",
      CreatedAfter: "2019-01-07T05:00:00Z"
    });
    if (amzResult.Orders.Order === null) {
      console.log("No orders returned. Done this cycle!");
    } else {
      let nextToken = amzResult.NextToken;
      let db = await initDatabase();
      let amzColl = db.collection("AmazonOrder");
      putOrdersToDB(amzResult.Orders.Order, amzColl);
      while (nextToken) {
        console.log('Find next Token :' + nextToken)
        amzResult = await amazonMws.orders.search({
          'Version': '2013-09-01',
          'Action': 'ListOrdersByNextToken',
          'SellerId': 'A1LZN806TROZ37',
          'MWSAuthToken': 'AKIAIMZQGS4V5KCJOSVA',
          'NextToken': nextToken
        })
        putOrdersToDB(amzResult.Orders.Order, amzColl);
        nextToken = amzResult.NextToken
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// function intervalFunc() {
//   console.log('Cant stop me now!');
// }

// setInterval(intervalFunc, Interval);

listOrders();
