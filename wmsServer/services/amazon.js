const Config = require('../config/configNew')

var amazonMws = require('amazon-mws')(Config.AWS_ACCESS_KEY_ID, Config.AWS_SECRET_ACCESS_KEY);

module.exports = {
  async listOrders (req, res, next) {
    let result = await amazonMws.orders.search({
          'Version': '2013-09-01',
          'Action': 'ListOrders',
          'SellerId': 'A1LZN806TROZ37',
          'MWSAuthToken': 'AKIAIMZQGS4V5KCJOSVA',
          'MarketplaceId.Id.1': 'ATVPDKIKX0DER',
          'LastUpdatedAfter': new Date(2018, 11, 24)
      })
    console.log(result)
    res.end()
    // await amazonMws.orders.search({
    //     'Version': '2013-09-01',
    //     'Action': 'ListOrders',
    //     'SellerId': 'A1LZN806TROZ37',
    //     'MWSAuthToken': 'AKIAIMZQGS4V5KCJOSVA',
    //     'MarketplaceId.Id.1': 'ATVPDKIKX0DER',
    //     'LastUpdatedAfter': new Date(2018, 11, 24)
    // }, function (error, response) {
    //   if (response){
    //     console.log('response', response);
    //     res.send(response);
    //     res.end();
    //     return;
    //   }
    //     if (error) {
    //         console.log('error ', error);
    //         return;
    //     }
        
    // }); 
  }
}
