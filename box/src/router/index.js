import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/pages/Login'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'
import Home from '@/components/Home'
import UserManages from '@/pages/usermanages/UserManages'
import CustomerManages from '@/pages/customermanages/CustomerManages'
import BoxManages from '@/pages/boxmanages/BoxManages'
import AdvertisementManages from '@/pages/advertisementmanages/AdvertisementManages'
import SuggestManages from '@/pages/suggestmanages/SuggestManages'
import Entmanages from "@/pages/entmanages/Entmanages"
import BoxiManages from '@/pages/boximanages/BoxiManages'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: SideBar
    },
    {
      path: '/header',
      name: 'header',
      component: Header
    },
    {
      path: '/home',
      name: 'home',
      component: Home,

      children: [{
          path: 'usermanages',
          name: 'usermanages',
          component: UserManages
        }, {
          path: 'customermanages',
          name: 'customermanages',
          component: CustomerManages
        },
        {
          path: 'boxmanages',
          name: 'boxmanages',
          component: BoxManages
        },
        {
          path: 'advertisementmanages',
          name: 'advertisementmanages',
          component: AdvertisementManages
        },
        {
          path: 'suggestmanages',
          name: 'suggestmanages',
          component: SuggestManages
        },
        {
          path: 'entmanages',
          name: 'entmanages',
          component: Entmanages
        },
        {
          path: 'boximanages',
          name: 'boximanages',
          component: BoxiManages
        }
      ]
    }
  ]
})
