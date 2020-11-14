<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-10 13:55:34
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-11-14 15:38:15
 * @Descripttion: 热力图
--> 
<template>
  <div id="map-container"
    style="width:100%;height:100%;">
    <div
      style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
        @click="addHeatMap()">热力图</button>
      <button
        @click="clearHeatMap()">clear</button>
    </div>
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
export default {
  name: 'HeatMap',
  data() {
    return {
      map: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/SpatialReference',
        'esri/graphic',
        'esri/geometry/Point',
        'esri/layers/FeatureLayer',
        'esri/renderers/HeatmapRenderer',
        'esri/geometry/Extent',
        'esri/map',
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @name: 清除热力图
     */
    clearHeatMap() {
      let layer = this.map.getLayer('热力图')
      this.map.removeLayer(layer)
    },

    /**
     * @name: 添加热力图
     * @param {data} Array
     * @param {type} String 权重值
     */
    // eslint-disable-next-line no-unused-vars
    addHeatMap(data, type) {
      let mockData = [
        { x: -13043465.062410325, y: 3857375.365345625, count: '10' },
        { x: -13041492.031617718, y: 3857031.398718342, count: '100' },
        { x: -13041042.964076541, y: 3855808.4062657813, count: '1000' },
        { x: -13044606.840520333, y: 3854317.8842142224, count: '100' },
        { x: -13043035.104126222, y: 3855120.4730112157, count: '10' },
      ]
      // let _type = type || 'ID'
      let _type = 'count'
      let layerDefinition = {
        geometryType: 'esriGeometryPoint',
        fields: [
          {
            name: _type,
            type: 'esriFieldTypeInteger',
            alias: _type,
          },
        ],
      }
      let featureCollection = {
        layerDefinition: layerDefinition,
        featureSet: null,
      }
      let heatMapLayer = new this.gisConstructor.FeatureLayer(
        featureCollection,
        {
          mode: this.gisConstructor.FeatureLayer.MODE_SNAPSHOT,
          outFields: ['*'],
          opacity: 1,
          id: '热力图',
        }
      )
      let heatmapRenderer = ''
      let colors = [
        'rgba(255, 0, 0, 0)',
        'rgb(0, 255, 0)',
        'rgb(255, 255, 0)',
        'rgb(255, 0, 0)',
      ]
      if (_type !== 'ID') {
        // 有权重值
        heatmapRenderer = new this.gisConstructor.HeatmapRenderer({
          field: _type,
          colors: colors,
          blurRadius: 10,
        })
      } else {
        // 无权重值
        heatmapRenderer = new this.gisConstructor.HeatmapRenderer({
          colors: colors,
          blurRadius: 50,
          maxPixelIntensity: 200,
          minPixelIntensity: 10,
        })
      }
      heatMapLayer.setRenderer(heatmapRenderer)
      this.map.addLayer(heatMapLayer, 9)
      for (let i = 0; i < mockData.length; i++) {
        let point = new this.gisConstructor.Point(
          mockData[i].x,
          mockData[i].y,
          new this.gisConstructor.SpatialReference(this.map.spatialReference)
        )
        let graphic = new this.gisConstructor.graphic(point)
        if (_type !== 'ID') {
          let count = Number(mockData[i].count)
          graphic.setAttributes({ count: count })
        }
        heatMapLayer.refresh()
        heatMapLayer.add(graphic)
      }
    },

    mapClickFun() {
      this.map.on('click', e => {
        console.log(e)
      })
    },

    /**
     * @name: 初始化地图
     */
    init() {
      // 加载 css
      loadCss('https://js.arcgis.com/3.32/esri/css/esri.css')
      // 加载模块
      loadModules(this.gisModules, {
        url: 'https://js.arcgis.com/3.32/',
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
      // 设置初始化范围
      let extent = {
        xmin: -117.1839455,
        ymin: 32.68087830000002,
        xmax: -117.15035189999998,
        ymax: 32.732100979999984,
      }
      /*
        如果坐标系是 4490，初始化范围需要设置空间参考坐标系
        // 'esri/SpatialReference',
        new this.gisConstructor.SpatialReference({
          wkid: 4490
        })
      */
      this.map.setExtent(
        new this.gisConstructor.Extent(
          extent.xmin,
          extent.ymin,
          extent.xmax,
          extent.ymax
        )
      )
    },
  },
}
</script>