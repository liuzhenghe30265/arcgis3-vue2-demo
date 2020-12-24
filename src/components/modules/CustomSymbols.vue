<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-06 14:34:54
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-12-24 16:25:12
 * @Descripttion: 自定义标注
--> 

<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div
         style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
              @click="addCustomSymbols()">自定义标注</button>
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
      positionLayer: '', // 定位图层
      customSymbolsLayer: '', // 自定义标注图层
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/SpatialReference',
        'esri/Color',
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
     * @param {Array} point
     * @param {Number} zoom
     */
    setCenterAndZoom(point, zoom) {
      let _point = new this.gisConstructor.Point(
        point[0],
        point[1],
        // new this.gisConstructor.SpatialReference(this.map.spatialReference)
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
     * @param {String} ID
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
     * @param {Array} data 坐标集合
     */
    addCustomSymbols() {
      this.clearCustomSymbols('自定义标注图层')

      // 添加点
      let pointList = [
        {
          x: -117.1938420441142,
          y: 32.71125985325878,
        },
        {
          x: -117.19693194889935,
          y: 32.697681773023454,
        },
        {
          x: -117.16978799366875,
          y: 32.69965000045051,
        }
      ]
      pointList.forEach(item => {
        let pointGeometry = new this.gisConstructor.Point(
          item.x,
          item.y,
          // new this.gisConstructor.SpatialReference(this.map.spatialReference) // 如果是墨卡托坐标（x: -13045958.820458127,y: 3857040.953346878），添加点、线、面图形时，需要设置空间坐标系。如果是经纬度（longitude: -117.17092525029109, latitude: 32.70459746302129），则不需要。
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
      })

      // 添加线
      let pathsList = [
        {
          paths: [
            [
              [-117.13848125004688, 32.72447482969995],
              [-117.13908206486619, 32.696598326560064]
            ]
          ]
        },
        {
          paths: [
            [
              [-117.17144023442182, 32.713787459203424],
              [-117.1675778534404, 32.69674278684837],
              [-117.15371619725147, 32.711187634893705]
            ]
          ]
        },
        {
          paths: [
            [
              [-117.1890355255595, 32.68865265066504],
              [-117.17075358891401, 32.68677447848705]
            ]
          ]
        }
      ]
      pathsList.forEach(item => {
        let polylineSymbol = new this.gisConstructor.SimpleLineSymbol(
          this.gisConstructor.SimpleLineSymbol.STYLE_SOLID,
          new this.gisConstructor.Color([255, 0, 0, 1]),
          3
        )
        let polylineGeometry = new this.gisConstructor.Polyline({
          paths: item.paths,
          // spatialReference: this.map.spatialReference
        })
        let polylineGraphic = new this.gisConstructor.graphic(
          polylineGeometry,
          polylineSymbol
        )
        this.customSymbolsLayer.add(polylineGraphic)
      })

      // 添加面
      let ringsList = [
        {
          rings: [
            [
              [-117.16294299626267, 32.72230857431127],
              [-117.14715014958301, 32.71891466839404],
              [-117.14732181095995, 32.71422075588838],
              [-117.14680682682909, 32.70497663679212],
              [-117.14981090092577, 32.70504886018483],
              [-117.15702067875779, 32.70750442075382],
              [-117.16294299626267, 32.72230857431127]
            ]
          ]
        },
        {
          rings: [
            [
              [-117.14577685856739, 32.697537314254866],
              [-117.14260112309374, 32.70028199087702],
              [-117.13358890080373, 32.69450362610648],
              [-117.13307391667286, 32.6906030184187],
              [-117.1387387421123, 32.692047707804406],
              [-117.14577685856739, 32.697537314254866]
            ]
          ]
        },
        {
          rings: [
            [
              [-117.1880055572978, 32.72339170858406],
              [-117.17538844609174, 32.719997843890354],
              [-117.18723308110151, 32.71299307648107],
              [-117.1880055572978, 32.72339170858406]
            ]
          ]
        }
      ]
      ringsList.forEach(item => {
        let polygonSymbol = new this.gisConstructor.SimpleFillSymbol(
          this.gisConstructor.SimpleFillSymbol.STYLE_SOLID,
          new this.gisConstructor.SimpleLineSymbol(
            {
              color: new this.gisConstructor.Color([0, 48, 166, 0.8]),
              width: 2,
            }
          ),
          new this.gisConstructor.Color([0, 48, 166, 0.25])
        )
        let polygonGeometry = new this.gisConstructor.Polygon({
          rings: item.rings,
          // spatialReference: this.map.spatialReference
        })
        let polygonGraphic = new this.gisConstructor.graphic(
          polygonGeometry,
          polygonSymbol
        )
        this.customSymbolsLayer.add(polygonGraphic)
      })


      // 添加多个文字图标标注
      let symbolData = [
        {
          text: 'marker1',
          x: -117.17144023442182,
          y: 32.713787459203424,
          type: 1,
        },
        {
          text: 'marker2',
          x: -117.15371619725147,
          y: 32.711187634893705,
          type: 2,
        },
        {
          text: 'marker3',
          x: -117.14968215489304,
          y: 32.70194320151179,
          type: 2,
        },
        {
          text: 'marker4',
          x: -117.18169700169476,
          y: 32.690675253443224,
          type: 3,
        },
        {
          text: 'marker5',
          x: -117.1675778534404,
          y: 32.69674278684837,
          type: 3,
        },
      ]
      let icon = ''
      symbolData.forEach(item => {
        if (item.type === 1) {
          icon = require('@/assets/images/ico01.png')
        } else if (item.type === 2) {
          icon = require('@/assets/images/ico02.png')
        } else {
          icon = require('@/assets/images/ico03.png')
        }
        let point = new this.gisConstructor.Point(
          item.x,
          item.y,
          // new this.gisConstructor.SpatialReference(this.map.spatialReference)
        )
        let symbol = new this.gisConstructor.PictureMarkerSymbol({
          url: icon,
          height: 20,
          width: 20,
        })
        let iconGraphic = new this.gisConstructor.graphic(
          point,
          symbol,
          item
        )
        this.customSymbolsLayer.add(iconGraphic)
        let textSymbol = new this.gisConstructor.TextSymbol(
          item.text,
          new this.gisConstructor.Font('16px'),
          new this.gisConstructor.Color([0, 0, 0])
        )
        let holoColor = this.gisConstructor.Color('#fff')
        textSymbol.setOffset(0, 15).setHaloColor(holoColor).setHaloSize(2)
        let textGraphic = new this.gisConstructor.graphic(
          new this.gisConstructor.Point(
            item.x,
            item.y,
            // new this.gisConstructor.SpatialReference(this.map.spatialReference)
          ),
          textSymbol
        )
        this.customSymbolsLayer.add(textGraphic)
      })
    },

    /**
     * @name: 初始化地图
     */
    init() {
      // 加载 css
      loadCss('https://js.arcgis.com/3.32/esri/css/esri.css')
      // loadCss('http://localhost:8081/static/arcgis/3.34/esri/css/esri.css')
      // 加载模块
      loadModules(this.gisModules, {
        // url: 'http://localhost:8081/static/arcgis/3.34/init.js',
        url: 'https://js.arcgis.com/3.32/',
      })
        .then(this.initMap)
        .then(this.addCustomLayer)
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
        slider: true
      })
      // 设置初始化范围
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
          extent.ymax
        )
      )
    },

    /**
     * @name: 添加自定义图层
     * @msg: 地图初始化完成之后添加自定义图层或服务
     */
    addCustomLayer() {
      this.positionLayer = new this.gisConstructor.GraphicsLayer({
        id: '定位图层',
        className: 'custom-layer', // 筛选出 className 相同的图层去清除这些图层上的标注
      })
      this.map.addLayer(this.positionLayer)

      // 高亮图层
      let highlightLayer = new this.gisConstructor.GraphicsLayer({
        id: '高亮图层',
        className: 'highlight-layer',
      })
      this.map.addLayer(highlightLayer)

      this.customSymbolsLayer = new this.gisConstructor.GraphicsLayer({
        id: '自定义标注图层',
        className: 'custom-layer',
      })
      this.map.addLayer(this.customSymbolsLayer)
      // 针对某个 GraphicsLayer 做点击等事件事件
      this.customSymbolsLayer.on('click', event => {
        if (event.graphic.attributes) {
          console.log(event.graphic.attributes)
          let point = [event.graphic.attributes.x, event.graphic.attributes.y]
          this.setCenterAndZoom(point)
        }
      })
      // 做图形高亮效果
      this.customSymbolsLayer.on("mouse-over", (evt) => {
        if (evt.graphic.geometry) {
          let geometry = evt.graphic.geometry
          if (geometry.x && geometry.y) {
            // 点
          }
          if (geometry.paths) {
            // 线
          }
          if (geometry.rings) {
            // 面
            let fillSymbol = new this.gisConstructor.SimpleFillSymbol().setColor(new this.gisConstructor.Color([0, 48, 166, 0.5]))
            fillSymbol.setOutline(new this.gisConstructor.SimpleLineSymbol(this.gisConstructor.SimpleLineSymbol.STYLE_SOLID, new this.gisConstructor.Color([0, 255, 255]), 3))
            let fillGraphic = new this.gisConstructor.graphic(evt.graphic.geometry, fillSymbol)
            highlightLayer.add(fillGraphic)
          }
        }
      })
      this.customSymbolsLayer.on("mouse-out", () => {
        highlightLayer.clear()
      })
    },
  },
}
</script>