const Login = require('./login')
const Org = require('./org')
const User = require('./user')
const Product = require('./product')
const Inventory = require('./inventory')
const Location = require('./location')
const ProductInv = require('./productInv')
const Shipment = require('./shipment')
const TempSchema = require('./tempSchema')
module.exports = (app) => {
  // from Login
  app.post('/login', Login.post)

  // from org
  app.post('/orgs', Org.post)
  app.get('/orgs', Org.get)
  app.get('/orgs/:name', Org.getByName)
  app.put('/orgs', Org.put)
  app.post('/orgs/delete', Org.deleteById)

  //from production inventory
  app.get('/prodInv/:UPC', ProductInv.getByUPC)
  app.get('/sellerInv/:UPC',ProductInv.getSellerInvByUPC)
  app.get('/prodInvAll', ProductInv.getAllProductInventory) //get all product inventory todo -pagination support
  app.get('/prodInvByLoc/:loc', ProductInv.getProdInvByLoc) //get product by locations, seprated by ,
  app.post('/prodInvAdjustBatch', ProductInv.postInvUpdate)
  app.post('/locInvMoveBatch', ProductInv.moveInvBatch) //move inventory
  app.post('/prodInvCheckBalance/', ProductInv.checkBalanceOfPrdInv)

  // from user
  app.post('/users', User.post)
  app.get('/users', User.get)

  // from product
  app.post('/products', Product.post)
  app.get('/products', Product.get)
  app.get('/products/:id', Product.get)
  app.put('/products', Product.put)

  app.post('/receiveUpdate', Product.updateProduct)
  app.post('/receiveDelete', Product.deleteProduct)

  // from inventory
  app.post('/inventory', Inventory.post)
  app.get('/inventory', Inventory.get)

  // from locations
  app.post('/locations', Location.post)
  app.get('/locations', Location.get)
  app.post('/changeLocDesc', Location.changeLocationDescription)
  app.post('/deleteLoc/:locID', Location.deleteLocation)

  // from shipment
  app.post('/shipments', Shipment.post)
  app.get('/shipments', Shipment.get)  //startdate, enddate, status - query parameter like inventory get
  app.get('/shipments/:Id', Shipment.getByShipmentId)
  app.post('/shipment/ship', Shipment.ship) //ship a shipment

  //from tempSchema
  app.post('/tempschema', TempSchema.post)
  app.get('/tempschema', TempSchema.get)
  app.post('/tempschema/deleteValue', TempSchema.deleteValue)
}