<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-08-03 15:40:22
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-09-20 17:41:42
 * @Descripttion: 加载 GeoServer
-->
<template>
  <div id="map-container"
       style="width:100%;height:100%;">
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
export default {
  name: 'GeoServer',
  data() {
    return {
      map: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/layers/TileInfo',
        'esri/SpatialReference', // 空间参考坐标系
        'esri/layers/WebTiledLayer',
        'esri/tasks/GeometryService', // 几何服务
        'esri/tasks/query', // 查询
        'esri/tasks/QueryTask', // 查询信息
        'esri/graphic', // 图形
        'esri/geometry/Polygon', // 多边形
        'esri/tasks/BufferParameters', // 缓冲区参数
        'esri/layers/ArcGISTiledMapServiceLayer', // 切片服务图层
        'esri/layers/ArcGISDynamicMapServiceLayer', // 动态服务图层
        'esri/geometry/Extent', // 范围
        'esri/map',
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    mapClickFun() {
      this.map.on('click', event => {
        let FHRlayer = this.map.getLayer('房户人')
        this.mapServiceClick(event, FHRlayer)
      })
    },

    /**
     * @name: 地图服务点击事件
     * @param {event}
     * @param {layer} 点击的图层
     */
    mapServiceClick(event, layer) {
      if (layer.visible) {
        let point = event.mapPoint
        let _point = this.map.toMap({
          spatialReference: event.screenPoint.spatialReference,
          type: 'point',
          x: event.screenPoint.x - 12,
          y: event.screenPoint.y - 12,
        })
        let distance = point.x - _point.x
        this.bufferGeometry(layer, event.mapPoint, distance)
      }
    },

    /**
     * @name: 获取点击缓冲区
     * @param {layer} 点击的图层
     * @param {geo} 点击的位置
     * @param {distance}
     */
    bufferGeometry(layer, geo, distance) {
      let bufferParameters = new this.gisConstructor.BufferParameters()
      bufferParameters.geometries = [geo]
      bufferParameters.distances = [distance]
      bufferParameters.outSpatialReference = this.map.spatialReference
      // 使用几何服务来执行几何计算和 web 编辑
      let GeometryServer = new this.gisConstructor.GeometryService(
        'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
      )
      GeometryServer.buffer(bufferParameters, geos => {
        if (geos.length > 0) {
          let polygon = new this.gisConstructor.Polygon(geos[0])
          let graphic = new this.gisConstructor.graphic(polygon)
          this.doQuery(layer, graphic.geometry)
        }
      })
    },

    /**
     * @name: 查询缓冲区
     * @param {layer}
     * @param {geometry}
     */
    doQuery(layer, geometry) {
      if (layer.visible) {
        let queryURL = layer.url + '/0'
        let query = new this.gisConstructor.query()
        query.geometry = geometry
        query.outFields = ['*']
        query.returnGeometry = true
        let queryTask = new this.gisConstructor.QueryTask(queryURL)
        queryTask.execute(
          query,
          featureSet => {
            let featuresLen = featureSet.features.length
            if (featuresLen > 0) {
              console.log(featureSet.features[0].attributes)
            }
          },
          error => {
            console.log(error)
          }
        )
      }
    },

    // 初始化地图
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
        // basemap: 'osm',
        spatialReference: new this.gisConstructor.SpatialReference({
          wkid: 4490,
        }),
        center: [111.26198271534789, 30.700635375217735],
        zoom: 12,
      })

      // geoServer
      let fhrTileInfo = new this.gisConstructor.TileInfo({
        dpi: 96,
        format: 'format/png',
        rows: 256,
        cols: 256,
        compressionQuality: 0,
        origin: {
          x: 73.62,
          y: 53.562,
        },
        spatialReference: new this.gisConstructor.SpatialReference({
          wkid: 4490,
        }),
        lods: [
          {
            level: 0,
            resolution: 0.0029066130081467374,
            scale: 1155581,
          },
          {
            level: 1,
            resolution: 0.001453305246431971,
            scale: 577790,
          },
          {
            level: 2,
            resolution: 7.266526232159855e-4,
            scale: 288895,
          },
          {
            level: 3,
            resolution: 3.63325053966595e-4,
            scale: 144447,
          },
          {
            level: 4,
            resolution: 1.816612693418997e-4,
            scale: 72223,
          },
          {
            level: 5,
            resolution: 9.082937702955209e-5,
            scale: 36111,
          },
          {
            level: 6,
            resolution: 0.0000454134308734,
            scale: 18055,
          },
          {
            level: 7,
            resolution: 0.0000227054577953,
            scale: 9027,
          },
        ],
      })
      let fhrExtent = new this.gisConstructor.Extent(
        110.66198271534789,
        30.600635375217735,
        111.81202300442796,
        31.007583283846188,
        new this.gisConstructor.SpatialReference({
          wkid: 4490,
        })
      )
      let fhrWmtsLayer = new this.gisConstructor.WebTiledLayer(
        'http://*****/geoserver/gwc/service/wmts?SERVICE=WMTS&request=GetTile&version=1.0.0&LAYER=YCWGHSJ:YCFHR&tileMatrixSet=ycfhr&TileMatrix={level}&TileRow={row}&TileCol={col}&style=&format=image/png',
        {
          id: '房户人',
          tileInfo: fhrTileInfo,
          initialExtent: fhrExtent,
          visible: false,
        }
      )
      this.map.addLayer(fhrWmtsLayer, 1)
      this.map.getLayer('房户人').setVisibility(true)
    },
  },
}
</script>