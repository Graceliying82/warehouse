import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Receiving from '@/components/wmsPages/Receiving'
import Shipping from '@/components/wmsPages/Shipping'
import ShipOrders from '@/components/wmsPages/ShipOrders'
import ShippingPrint from '@/components/wmsPages/ShippingPrint'
import BatchPick from '@/components/wmsPages/ShippingBatchPick'
import PrdMoveIn from '@/components/wmsPages/PrdMoveIn'
import PrdMoveOut from '@/components/wmsPages/PrdMoveOut'
import InventoryLocations from '@/components/wmsPages/InventoryLocations'
import UpgradeSchema from '@/components/wmsPages/UpgradeSchema'
import UpgradeInstructions from '@/components/wmsPages/UpgradeInstructions'
import UpgradeRequest from '@/components/wmsPages/UpgradeRequest'
import UpgradeRequestList from '@/components/wmsPages/UpgradeRequestList'
import UpgradePrdGen from '@/components/wmsPages/UpgradePrdGen'
import Inventory from '@/components/wmsPages/Inventory'
import ProductsList from '@/components/wmsPages/ProductsList'
import ProductInputDetail from '@/components/wmsPages/ProductInputDetail'
import ProductInventory from '@/components/wmsPages/ProductInventory'
import Reports from '@/components/wmsPages/Reports'
import ManageUser from '@/components/wmsPages/ManageUser'
import ManageOrg from '@/components/wmsPages/ManageOrg'
import ReceiveRecords from '@/components/wmsPages/ReceiveRecords'
import InvtLocMg from '@/components/wmsPages/InvtLocMg'
import InvtLocEidt from '@/components/wmsPages/InvtLocEdit'
import BatchPickPlan from '@/components/wmsPages/BatchPickPlan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/receiving',
      name: 'receiving',
      component: Receiving
    },
    {
      path: '/shipping',
      name: 'shipping',
      component: Shipping
    },
    {
      path: '/shipOrders',
      name: 'shipOrders',
      component: ShipOrders
    },
    {
      path: '/ShippingPrint',
      name: 'shippingPrint',
      component: ShippingPrint
    },
    {
      path: '/BatchPick',
      name: 'batchPick',
      component: BatchPick
    },
    {
      path: '/PrdMoveIn',
      name: 'PrdMoveIn',
      component: PrdMoveIn
    },
    {
      path: '/PrdMoveOut',
      name: 'PrdMoveOut',
      component: PrdMoveOut
    },
    {
      path: '/inventoryLocations',
      name: 'inventoryLocations',
      component: InventoryLocations
    },
    {
      path: '/upgradeSchema',
      name: 'upgradeSchema',
      component: UpgradeSchema
    },
    {
      path: '/upgradeInstructions',
      name: 'upgradeInstructions',
      component: UpgradeInstructions
    },
    {
      path: '/upgradeRequest',
      name: 'upgradeRequest',
      component: UpgradeRequest
    },
    {
      path: '/upgradeRequestList',
      name: 'upgradeRequestList',
      component: UpgradeRequestList
    },
    {
      path: '/upgradePrdGen',
      name: 'upgradePrdGen',
      component: UpgradePrdGen
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: Inventory
    },
    {
      path: '/productsList',
      name: 'ProductsList',
      component: ProductsList
    },
    {
      path: '/productInputDetail',
      name: 'productInputDetail',
      component: ProductInputDetail
    },
    {
      path: '/productInputDetail/:idUPC',
      name: 'productDetail',
      component: ProductInputDetail
    },
    {
      path: '/productInventory',
      name: 'productInventory',
      component: ProductInventory
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/receiveRecords',
      name: 'receiveRecords',
      component: ReceiveRecords
    },
    {
      path: '/invtLocMg',
      name: 'invtLocMg',
      component: InvtLocMg
    },
    {
      path: '/invtLocEdit',
      name: 'invtLocEdit',
      component: InvtLocEidt
    },
    {
      path: '/manageUser',
      name: 'manageUser',
      component: ManageUser
    },
    {
      path: '/manageOrg',
      name: 'manageOrg',
      component: ManageOrg
    },
    {
      path: '/batchPickPlan',
      name: 'batchPickPlan',
      component: BatchPickPlan
    }
  ]
})
