<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-11 09:06:28
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-12-22 18:31:22
 * @Descripttion: 绘制工具
--> 

<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div
         style="position:absolute;right:50px;top:50px;z-index:999;">
      <span>标绘：</span>
      <button
              @click="drawingGraphicsTool('标绘', 'point')">点</button>
      <button
              @click="drawingGraphicsTool('标绘', 'polyline')">线</button>
      <button
              @click="drawingGraphicsTool('标绘', 'polygon')">面</button>
      <button
              @click="drawingGraphicsTool('标绘', 'point', 'text')">文字</button>
      <br>
      <span>空间测量：</span>
      <button
              @click="drawingGraphicsTool('空间测量', 'point')">坐标测量</button>
      <button
              @click="drawingGraphicsTool('空间测量', 'polyline')">距离测量</button>
      <button
              @click="drawingGraphicsTool('空间测量', 'polygon')">面积测量</button>
      <br>
      <span>空间统计：</span>
      <button
              @click="drawingGraphicsTool('空间统计', 'point')">点</button>
      <button
              @click="drawingGraphicsTool('空间统计', 'polyline')">线</button>
      <button
              @click="drawingGraphicsTool('空间统计', 'polygon')">面</button>
      <br>
      <button
              @click="drawingGraphicsTool()">clear</button>
    </div>
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
import { DrawingGraphics } from './DrawingGraphics.js'
export default {
  name: 'DrawingGraphics',
  components: {},
  data() {
    return {
      map: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/map',
        'esri/SpatialReference',
        'esri/geometry/Extent',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/geometry/geometryEngine',
        'esri/tasks/GeometryService',
        'esri/tasks/ProjectParameters',
        'esri/tasks/AreasAndLengthsParameters',
        'esri/tasks/LengthsParameters',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/tasks/BufferParameters',
        'esri/graphic',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/TextSymbol',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/Font',
        'esri/layers/GraphicsLayer',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/toolbars/draw',
        'esri/Color',
        'dojo/_base/declare',
        'dojo/number',
        'esri/config',
        'esri/geometry/normalizeUtils',
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @name: 地图点击事件
     */
    mapClickFun() {
      this.map.on('click', () => { })
    },

    /**
     * @name: 绘制工具
     * @msg: 标绘,空间测量,空间统计
     * @param {String} name
     * @param {String} type
     * @param {String} text
     */
    drawingGraphicsTool(name, type, text) {
      if (name && type) {
        let option = {}
        if (name === '标绘') {
          option = {
            name: '标绘',
            type: type,
            text: text ? true : false,
          }
        }
        if (name === '空间测量') {
          option = {
            GeometryServerURL:
              'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
            name: '空间测量',
            type: type,
          }
        }
        if (name === '空间统计') {
          option = {
            StatisticalServerURL:
              'https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces4/MapServer/0',
            GeometryServerURL:
              'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
            distances: 100,
            name: '空间统计',
            type: type,
          }
        }
        DrawingGraphics.call(this, 'active', option)
      } else {
        DrawingGraphics.call(this, 'clear')
      }
    },

    /**
     * @name: 初始化地图
     */
    init() {
      // 加载 css
      loadCss('https://js.arcgis.com/3.32/esri/css/esri.css')
      // 加载模块
      loadModules(this.gisModules, {
        url: 'https://js.arcgis.com/3.32/init.js',
      })
        .then(this.initMap)
        .then(this.mapClickFun)
    },
    initMap(args) {
      // 将 ArcGIS 的每个功能模块都存放到 gisConstructor 中
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop()
        this.gisConstructor[name] = args[k]
      }
      this.map = new this.gisConstructor.map('map-container', {
        basemap: 'osm',
        logo: false,
        slider: true,
      })
      let extent = {
        xmin: -117.1839455,
        ymin: 32.68087830000002,
        xmax: -117.15035189999998,
        ymax: 32.732100979999984,
      }
      this.map.setExtent(
        new this.gisConstructor.Extent(
          extent.xmin,
          extent.ymin,
          extent.xmax,
          extent.ymax,
          new this.gisConstructor.SpatialReference()
        )
      )
      // 添加一个 MapServer 做测试
      let StoryMapPlaces4 = new this.gisConstructor.ArcGISDynamicMapServiceLayer(
        'https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces4/MapServer',
        {
          id: 'StoryMapPlaces4',
          opacity: 1,
          visible: true,
        }
      )
      this.map.addLayer(StoryMapPlaces4, 2)
    },
  },
}
</script>
