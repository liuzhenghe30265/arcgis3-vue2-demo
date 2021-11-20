import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: '初始化',
    component: resolve => require(['@/components/InitMap.vue'], resolve),
  },
  {
    path: '/MapServer',
    name: '地图服务',
    component: resolve => require(['@/components/modules/MapServer.vue'], resolve),
  },
  {
    path: '/CustomSymbols',
    name: '自定义标注',
    component: resolve => require(['@/components/modules/CustomSymbols.vue'], resolve),
  },
  {
    path: '/DrawingGraphics',
    name: '绘制工具',
    component: resolve => require(['@/components/modules/DrawingGraphics.vue'], resolve),
  },
  {
    path: '/HeatMap',
    name: '热力图',
    component: resolve => require(['@/components/modules/HeatMap.vue'], resolve),
  },
  {
    path: '/TrackPlayback',
    name: '轨迹回放',
    component: resolve => require(['@/components/modules/TrackPlayback.vue'], resolve),
  },
  {
    path: '/AMap',
    name: '高德地图',
    component: resolve => require(['@/components/modules/AMap.vue'], resolve),
  }
]

const router = new VueRouter({
  routes
})

export default router