<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-06 14:34:54
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-11-06 18:31:56
 * @Descripttion: 自定义标注
--> 

<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div
         style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
              @click="addCustomSymbols(symbolData)">自定义标注</button>
      <button
              @click="clearCustomSymbols()">清除标注</button>
    </div>
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
export default {
  name: 'CustomSymbols',
  data() {
    return {
      symbolData: [
        {
          address: 'marker1',
          x: -13043465.062410325,
          y: 3857375.365345625,
          type: 1,
        },
        {
          address: 'marker2',
          x: -13041492.031617718,
          y: 3857031.398718342,
          type: 2,
        },
        {
          address: 'marker3',
          x: -13041042.964076541,
          y: 3855808.4062657813,
          type: 2,
        },
        {
          address: 'marker4',
          x: -13044606.840520333,
          y: 3854317.8842142224,
          type: 3,
        },
        {
          address: 'marker5',
          x: -13043035.104126222,
          y: 3855120.4730112157,
          type: 3,
        },
      ],
      positionLayer: '', // 定位图层
      customSymbolsLayer: '', // 自定义标注图层
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/SpatialReference',
        'esri/Color',
        'esri/symbols/TextSymbol',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/PictureMarkerSymbol', // 图片标注
        'esri/symbols/TextSymbol', // 文字标注
        'esri/symbols/Font',
        'esri/geometry/Extent',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/geometry/geometryEngine',
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
    /**
     * @name: 地图点击事件
     */
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
      let _point = new this.gisConstructor.Point(
        point[0],
        point[1],
        new this.gisConstructor.SpatialReference(this.map.spatialReference)
      )
      if (zoom) {
        this.map.centerAt(_point)
        this.map.centerAndZoom(_point, zoom)
      } else {
        this.map.centerAt(_point)
      }
      this.clearCustomSymbols('定位图层')
      let icon = require('@/assets/images/positioning.gif')

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
     * @param {data} Array 坐标集合
     */
    addCustomSymbols(data) {
      this.clearCustomSymbols('自定义标注图层')
      let icon = ''
      let font = new this.gisConstructor.Font('16px')
      // 添加单个点
      let pointGeometry = new this.gisConstructor.Point(
        -13043281.135811023,
        3855505.0468097497,
        new this.gisConstructor.SpatialReference(this.map.spatialReference)
      )
      let pointSymbol = new this.gisConstructor.SimpleMarkerSymbol({
        color: new this.gisConstructor.Color([255, 0, 0]),
        width: 10,
        height: 10,
      })
      let pointSymbolGraphic = new this.gisConstructor.graphic(
        pointGeometry,
        pointSymbol,
      )
      this.customSymbolsLayer.add(pointSymbolGraphic)

      // 添加线
      let lineJson = {
        paths: [[-13044279.594493024, 3856594.274462842], [-13044169.71626486, 3856011.442122152], [-13043644.211695386, 3856011.442122152], [-13043586.883924171, 3855763.021780219], [-13042918.059926659, 3855810.7949228985]],
        spatialReference: new this.gisConstructor.SpatialReference(this.map.spatialReference)
      }
      let lineGeometry = new this.gisConstructor.Polyline(lineJson)
      let lineSymbol = new this.gisConstructor.SimpleLineSymbol()
      let lineSymbolGraphic = new this.gisConstructor.graphic(
        lineGeometry,
        lineSymbol,
      )
      console.log(lineSymbolGraphic)
      this.customSymbolsLayer.add(lineSymbolGraphic)
      // 添加面


      // 添加多个文字图标标注
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 1) {
          icon = require('@/assets/images/ico01.png')
        } else if (data[i].type === 2) {
          icon = require('@/assets/images/ico02.png')
        } else {
          icon = require('@/assets/images/ico03.png')
        }
        let point = new this.gisConstructor.Point(
          data[i].x,
          data[i].y,
          new this.gisConstructor.SpatialReference(this.map.spatialReference)
        )
        let symbol = new this.gisConstructor.PictureMarkerSymbol({
          url: icon,
          height: 20,
          width: 20,
        })
        let iconGraphic = new this.gisConstructor.graphic(
          point,
          symbol,
          data[i]
        )
        this.customSymbolsLayer.add(iconGraphic)
        let textSymbol = new this.gisConstructor.TextSymbol(
          data[i].address,
          font,
          new this.gisConstructor.Color([0, 0, 0])
        )
        let holoColor = this.gisConstructor.Color('#fff')
        textSymbol.setOffset(0, 15).setHaloColor(holoColor).setHaloSize(2)
        let textGraphic = new this.gisConstructor.graphic(
          new this.gisConstructor.Point(
            data[i].x,
            data[i].y,
            new this.gisConstructor.SpatialReference(this.map.spatialReference)
          ),
          textSymbol
        )
        this.customSymbolsLayer.add(textGraphic)
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
        wkid: '4490',
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