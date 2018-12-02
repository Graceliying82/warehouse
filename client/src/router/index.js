import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Receiving from '@/components/wmsPages/Receiving'
import Shipping from '@/components/wmsPages/Shipping'
import ShippingRecords from '@/components/wmsPages/ShippingRecords'
import PrdMoveIn from '@/components/wmsPages/PrdMoveIn'
import PrdMoveOut from '@/components/wmsPages/PrdMoveOut'
import InventoryLocations from '@/components/wmsPages/InventoryLocations'
import UpgradeApprove from '@/components/wmsPages/UpgradeApprove'
import UpgradeRequest from '@/components/wmsPages/UpgradeRequest'
import UpgradeRequestRecord from '@/components/wmsPages/UpgradeRequestRecord'
import Inventory from '@/components/wmsPages/Inventory'
import Products from '@/components/wmsPages/Products'
import Reports from '@/components/wmsPages/Reports'
import CreateUser from '@/components/wmsPages/CreateUser'
import DeleteUser from '@/components/wmsPages/DeleteUser'
import ReceiveRecords from '@/components/wmsPages/ReceiveRecords'
import InvtLocMg from '@/components/wmsPages/InvtLocMg'

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
      path: '/shippingRecords',
      name: 'shippingRecords',
      component: ShippingRecords
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
      path: '/upgradeApprove',
      name: 'upgradeApprove',
      component: UpgradeApprove
    },
    {
      path: '/upgradeRequest',
      name: 'upgradeRequest',
      component: UpgradeRequest
    },
    {
      path: '/upgradeRequestRecord',
      name: 'upgradeRequestRecord',
      component: UpgradeRequestRecord
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: Inventory
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/createUser',
      name: 'createUser',
      component: CreateUser
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/deleteUser',
      name: 'deleteUser',
      component: DeleteUser
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
    }
  ]
})
