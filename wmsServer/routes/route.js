const Login = require('./login')
const Org = require('./org')
const User = require('./user')
const Product = require('./product')
const Inventory = require('./inventory')
const Location = require('./location')
const ProductInv = require('./productInv')
const Shipment = require('./shipment')
const TempSchema = require('./tempSchema')
const Upgrade = require('./upgrade')
const Instruction = require('./instruction')
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
  app.get('/locInv/:UPC', ProductInv.getLocInvByUPC)
  app.get('/getSellerInvAndOrgList/:UPC', ProductInv.getSellerInvAndOrgList)
  app.get('/prodInvAll', ProductInv.getAllProductInventory) //get all product inventory todo -pagination support
  app.get('/prodInvByLoc/:loc', ProductInv.getProdInvByLoc) //get product by locations, seprated by
  app.get('/getUPCByPid/:PID', Product.getUPCByPid)
  app.post('/prodInvAdjustBatch', ProductInv.postInvUpdate)
  app.post('/locInvMoveBatch', ProductInv.moveInvBatch) //move inventory
  app.post('/prodInvCheckBalance/', ProductInv.checkBalanceOfPrdInv)
  app.post('/prodInv/getUPCFamilyListByOrg', ProductInv.getUPCFamilyListByOrg)

  // from user
  app.post('/users', User.post)
  app.get('/users', User.get)

  // from product
  app.post('/products', Product.post)
  app.get('/products', Product.get)
  app.get('/products/:id', Product.get)
  app.put('/products', Product.put)
  app.post('/receiveUpdate', Product.updateProduct)
  app.post('/receiveDelete', Product.deleteInvReceive)
  app.post('/products/deleteConfig', Product.deleteConfig)
  app.post('/products/getUPCsByOrig', Product.getUPCsByOrig)
  app.post('/products/deleteProduct', Product.deleteProduct)
  app.post('/products/giveOldPrdPid', Product.giveOldPrdPid)
  //add parts handle logic to product
  app.post('/products/parts', Product.createPart)

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
  app.post('/shipments/getByShipmentId', Shipment.getByShipmentId)
  app.post('/shipments/ship', Shipment.ship) //ship a shipment
  app.post('/shipments/deleteByTracking', Shipment.deleteByTracking)

  // from upgrade
  app.post('/upgrades', Upgrade.post)
  app.get('/upgrades', Upgrade.get)
  app.post('/upgrades/cancelUpgrade', Upgrade.cancelUpgrade)
  app.get('/upgrades/getUpdPrdNeedInstr', Upgrade.getUpdPrdNeedInstr)
  app.post('/upgrades/fastUpgrade', Upgrade.fastUpgrade)
  app.post('/upgrades/finishUpgrade', Upgrade.finishUpgrade)

  // from instructions
  app.post('/instructions', Instruction.post)
  app.post('/instructions/getByID', Instruction.getByID)
  app.get('/instructions', Instruction.get)

  //from tempSchema
  app.post('/tempschema', TempSchema.post)
  app.get('/tempschema', TempSchema.get)
  app.post('/tempschema/deleteValue', TempSchema.deleteValue)
}