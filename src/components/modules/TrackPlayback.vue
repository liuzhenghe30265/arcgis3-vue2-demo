<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-06 14:34:54
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-09-20 17:42:24
 * @Descripttion: 轨迹回放
--> 

<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div
         style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
              @click="trackPlaybackFun(symbolData)">轨迹回放</button>
      <button
              @click="trackPlaybackFun()">清除标注</button>
    </div>
    <div id="pathBar"></div>
    <div id="pathContent"
         style="width: 100%;height: 100%;position: absolute;display:none;">
      <svg id="pathSvg"
           style="width: 100%;height: 100%;position: absolute">
        <path d=""
              stroke="#767FF9"
              stroke-width="2"
              fill="none"
              id="gpsPath"></path>
        <image width="24"
               height="24"
               :href="wgyGJ"
               x="-12"
               y="-12">
          <animateMotion id="gpsAnimateMotion"
                         begin=""
                         end=""
                         rotate="0"
                         dur="50s"
                         repeatCount="indefinite"
                         calcMode="linear">
            <mpath
                   xlink:href='#gpsPath' />
          </animateMotion>
        </image>
        <image width="24"
               height="24"
               :href="wgyGJ"
               x="-12"
               y="-12" />
      </svg>
    </div>
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
// import pathLineLayer from './PathLineLayer.js'
export default {
  name: 'TrackPlayback',
  data() {
    return {
      symbolData: [
        {
          address: '昆俞北路明旭社区明盛园4号楼',
          x: 117.29548,
          y: 39.16232,
        },
        {
          address: '津北公路',
          x: 117.432727,
          y: 39.080622,
        },
        {
          address: '华明街弘顺道金泰丽湾嘉园7号楼',
          x: 117.365064,
          y: 39.163788,
        },
      ],
      positionLayer: '', // 定位图层
      customSymbolsLayer: '', // 自定义标注图层
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/Color',
        'esri/symbols/PictureMarkerSymbol', // 图片标注
        'esri/symbols/TextSymbol', // 文字标注
        'esri/symbols/Font',
        'esri/geometry/Extent', // 范围
        'esri/geometry/Point',
        'esri/layers/GraphicsLayer', // 图形图层
        'esri/graphic', // 图形
        'esri/map',
      ],
      map: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    mapClickFun() {
      this.map.on('click', e => {
        console.log(e)
      })
    },

    /**
     * @name: 设置中心点和缩放
     * @param {point} Array
     * @param {zoom} Number
     * @return:
     */
    setCenterAndZoom(point, zoom) {
      if (zoom) {
        this.map.centerAt(point)
        this.map.centerAndZoom(point, zoom)
      } else {
        this.map.centerAt(point)
      }
      this.clearCustomSymbols('定位图层')
      let icon = require('@/assets/images/positioning.gif')
      let _point = new this.gisConstructor.Point(point)
      let symbol = new this.gisConstructor.PictureMarkerSymbol(icon, 50, 50)
      let graphic = new this.gisConstructor.graphic(_point, symbol)
      this.positionLayer.add(graphic)
    },

    /**
     * @name: 根据图层 ID 清除图层上的图形标注
     * @param {ID} 图层 id
     */
    clearCustomSymbols(ID) {
      if (ID) {
        // 传入图层 id，清除指定图层上的标注
        let layer = this.map.getLayer(ID)
        if (layer) {
          layer.clear()
        }
      } else {
        // 没有传入 id，先获取所有显示的图层，根据 className 过滤出标注图层，然后清除标注
        let scale = this.map.getScale()
        let layers = this.map.getLayersVisibleAtScale(scale)
        let _layers = layers.filter(item => {
          return item.className === 'custom-layer'
        })
        _layers.forEach(element => {
          element.clear()
        })
      }
    },

    /**
     * @name: 添加自定义标注
     * @param {data}
     */
    trackPlaybackFun(data) {
      console.log(data)
      // console.log(pathLineLayer)
      // let options = {
      //   data: data,
      //   name: '轨迹',
      //   domId: "pathBar",
      //   domPath: "pathContent",
      //   symbolPic: require('@/common/img/icon_wgy.png')
      // }
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
        .then(this.addCustomLayer)
        .then(this.mapClickFun)
    },

    /**
     * @name: 添加自定义图层
     */
    addCustomLayer() {
      this.positionLayer = new this.gisConstructor.GraphicsLayer({
        id: '定位图层',
        className: 'custom-layer', // 筛选出 className 相同的图层去清除这些图层上的标注
      })
      this.map.addLayer(this.positionLayer)

      this.customSymbolsLayer = new this.gisConstructor.GraphicsLayer({
        id: '自定义标注图层',
        className: 'custom-layer',
      })
      this.map.addLayer(this.customSymbolsLayer)
      this.customSymbolsLayer.on('click', event => {
        if (event.graphic.attributes) {
          console.log(event.graphic.attributes)
          let point = [event.graphic.attributes.x, event.graphic.attributes.y]
          this.setCenterAndZoom(point)
        }
      })
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
        xmin: 116.22979869019117,
        ymin: 39.78578351593684,
        xmax: 116.56048958074179,
        ymax: 40.077314154870024,
      }
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