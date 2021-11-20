import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    children:[
      {
        path: 'serversControl',
        name: 'ServersControl',
        component: () => import('../views/Home/Children/ServersControl.vue'),    
      },
      {
        path: 'userAdmin/accessAdmin',
        name: 'AccessAdmin',
        component: () => import('../views/Home/Children/UserAdmin/AccessAdmin.vue'),
      },
      {
        path: 'userAdmin/test',
        name: 'Test',
        component: () => import('../views/Home/Children/UserAdmin/Test.vue'),
      },
      {
        path: 'charts',
        name: 'Charts',
        component: () => import('../views/Home/Children/Charts.vue'),
      },
      {
        path: 'createArticle',
        name: 'CreateArticle',
        component: () => import('../views/Home/Children/CreateArticle.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../components/Profile'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
