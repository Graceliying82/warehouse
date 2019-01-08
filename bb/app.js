const Config = require('./config')
const Interval = 1500

var amazonMws = require('amazon-mws')(Config.AWS_ACCESS_KEY_ID, Config.AWS_SECRET_ACCESS_KEY)


async function  listOrders () {
  let result = await amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': 'A1LZN806TROZ37',
        'MWSAuthToken': 'AKIAIMZQGS4V5KCJOSVA',
        'MarketplaceId.Id.1': 'ATVPDKIKX0DER',
        'LastUpdatedAfter': new Date(2018, 11, 24)
    })
  console.log(result)
};


function intervalFunc() {
  console.log('Cant stop me now!');
}

setInterval(intervalFunc, Interval);