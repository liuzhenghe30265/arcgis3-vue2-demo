<template>
  <div id="map-container" style="width:100%;height:100%;">
    <div id="HomeButton"></div>
    <div id="LocateButton"></div>
    <div id="navigation-toolbar" class="navigation-toolbar">
      <div class="nt-translation">
        <button id="resize"></button>
        <button id="east"></button>
        <button id="west"></button>
        <button id="south"></button>
        <button id="north"></button>
      </div>
      <div class="nt-zoom">
        <button id="rule" class="rule"></button>
        <button id="site"></button>
        <button id="zoomUp"></button>
        <button id="zoomDowm"></button>
      </div>
    </div>
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
export default {
  name: 'InitMap',
  data() {
    return {
      navToolbar: null,
      map: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/geometry/webMercatorUtils',// 墨卡托坐标转换
        'esri/geometry/Point',
        'esri/SpatialReference',
        'esri/tasks/GeometryService',
        'esri/tasks/ProjectParameters',
        'esri/toolbars/navigation', // 地图导航工具
        'dojo/_base/declare',
        'esri/dijit/OverviewMap', // 小地图
        'esri/dijit/Scalebar', // 比例尺
        'esri/dijit/LocateButton', // 当前位置
        'esri/dijit/HomeButton', // 返回到地图默认开始范围
        'esri/layers/OpenStreetMapLayer', // OSM
        'esri/layers/ArcGISTiledMapServiceLayer', // 切片图层服务
        'esri/geometry/Extent', // 范围
        'esri/map',
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
      this.map.on('click', e => {
        console.log(e)

        // arcgis4 中，地图点击事件返回的 mapPoint 有两种坐标信息，墨卡托坐标（x: -13045958.820458127,y: 3857040.953346878）和经纬度（longitude: -117.17092525029109, latitude: 32.70459746302129），arcgis3 中只返回了墨卡托坐标。获取经纬度：
        // 方式一：
        console.log(this.gisConstructor.webMercatorUtils.xyToLngLat(e.mapPoint.x, e.mapPoint.y))

        // 方式二：
        console.log([e.mapPoint.getLongitude(), e.mapPoint.getLatitude()])

        // 方式三：
        let PrjParams = new this.gisConstructor.ProjectParameters()
        PrjParams.geometries = [e.mapPoint] // Array 可以写多个点批量转换
        PrjParams.outSR = new this.gisConstructor.SpatialReference({ wkid: 4490 }) // 输出的坐标系
        PrjParams.transformForward = true // 是否向前转换
        let geometryService = new this.gisConstructor.GeometryService('https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer')
        geometryService.project(PrjParams, (outputpoints) => {
          console.log(outputpoints[0])
        })

      })
    },

    /**
     * @name: 初始化地图
     */
    init() {
      // 加载 css
      // loadCss('http://localhost/js.arcgis.com/3.32/esri/css/esri.css')
      loadCss('https://js.arcgis.com/3.32/esri/css/esri.css')
      // 加载模块
      loadModules(this.gisModules, {
        // url: 'http://localhost/js.arcgis.com/3.32/init.js'
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
        // center: [-117.16856490635791, 32.70441690351651],
        // basemap: 'osm', // hybrid
        zoom: 12,
        logo: false,
        slider: true,
        isZoomSlider: true,
        isDoubleClickZoom: false,
        autoResize: true,
        // maxZoom: 16, //地图最大缩放级别
        // minZoom: 7, //地图最小缩放级别
        // spatialReference: {
        //   wkid: '4490'
        // }
      })

      /**
       * 添加 OSM 有两种方式：
       * 方式一：在初始化 map 时设置 basemap 属性 basemap: 'osm'
       * 方式二：加载 OpenStreetMapLayer 模块，创建 OSM layer，再添加 layer 到 map 中，可单独对 OSM 进行配置
       */
      // let basemap = new this.gisConstructor.OpenStreetMapLayer({
      //   id: 'OSMlayer',
      //   visible: true,
      //   opacity: 1,
      //   // displayLevels: [1, 2, 3] // 在指定缩放等级下显示
      // })
      // this.map.addLayer(basemap)

      // 添加一个电子地图
      let basemap = new this.gisConstructor.ArcGISTiledMapServiceLayer('https://sampleserver6.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer', {
        id: '电子地图',
        visible: true,
      })
      this.map.addLayer(basemap)

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
          extent.ymax,
          // new this.gisConstructor.SpatialReference({
          //   wkid: 4490
          // })
        )
      )

      // 返回到地图默认开始范围（现在是根据 center 设置的，如何根据 extent 设置？）
      let home = new this.gisConstructor.HomeButton(
        {
          map: this.map,
        },
        'HomeButton'
      )
      home.startup()

      // 当前位置
      let geoLocate = new this.gisConstructor.LocateButton(
        {
          map: this.map,
        },
        'LocateButton'
      )
      geoLocate.startup()

      // 比例尺
      // eslint-disable-next-line no-unused-vars
      let scalebar = new this.gisConstructor.Scalebar({
        map: this.map,
        // "dual" displays both miles and kilometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: 'metric',
      })

      // 小地图
      // let overviewMapDijit = new this.gisConstructor.OverviewMap({
      //   map: this.map,
      //   visible: true,
      // })
      // overviewMapDijit.startup()

      // 自定义导航空间（地图平移，缩放，设置范围等功能）
      let innerDOM = document.getElementById('navigation-toolbar')
      let allBtn = innerDOM.querySelectorAll('button')
      let siteDOM = ''
      let ruleDOM = ''
      let ruleDOMTop = ''
      let bottom = 40
      let step = 3
      for (let i = 0; i < allBtn.length; i++) {
        if (allBtn[i].getAttribute('id') === 'site') {
          siteDOM = allBtn[i]
          siteDOM.style.bottom = this.map.getLevel() * step + bottom + 'px'
        }
        if (allBtn[i].getAttribute('id') === 'rule') {
          ruleDOM = allBtn[i]
          ruleDOMTop = ruleDOM.getBoundingClientRect().top
        }
        allBtn[i].onclick = event => {
          let domID = event.target.getAttribute('id')
          switch (domID) {
            case 'resize':
              this.map.setExtent(
                new this.gisConstructor.Extent(
                  extent.xmin,
                  extent.ymin,
                  extent.xmax,
                  extent.ymax
                )
              )
              siteDOM.style.bottom = this.map.getLevel() * step + bottom + 'px'
              break
            case 'east':
              this.map.panRight()
              break
            case 'west':
              this.map.panLeft()
              break
            case 'north':
              this.map.panDown()
              break
            case 'south':
              this.map.panUp()
              break
            case 'zoomUp':
              this.map.setLevel(this.map.getLevel() + 1)
              siteDOM.style.bottom = this.map.getLevel() * step + bottom + 'px'
              break
            case 'zoomDowm':
              this.map.setLevel(this.map.getLevel() - 1)
              siteDOM.style.bottom = this.map.getLevel() * step + bottom + 'px'
              break
            case 'rule':
              console.log(event.clientY)
              console.log(ruleDOMTop)
              // siteDOM.style.bottom = event.clientY - ruleDOMTop + 'px'
              break
          }
        }
      }
      // let siteDOMBottom = Number(siteDOM.style.bottom.replace('px', ''))
      // siteDOM.onmousedown = (down) => {
      //   // 按下时据窗口的距离
      //   let distanceY = down.clientY
      //   siteDOM.onmousemove = (move) => {
      //     let topResult = distanceY - move.clientY
      //     siteDOM.style.bottom = siteDOMBottom + topResult + 'px'
      //   }
      //   siteDOM.onmouseup = () => {
      //     siteDOM.onmouseup = null
      //     siteDOM.onmousemove = null
      //   }
      // }
    },
  },
}
</script>

<style lang="scss">
#map-container {
  position: relative;
}

#HomeButton {
  position: absolute;
  top: 95px;
  left: 20px;
  z-index: 50;
}

#LocateButton {
  position: absolute;
  top: 145px;
  left: 20px;
  z-index: 50;
}

.esriScalebarLabel {
  width: auto !important;
}

.esriOverviewMap.ovwTR {
  top: 50px !important;
}

#navigation-toolbar {
  position: absolute;
  top: 20px;
  left: 100px;
  z-index: 9;
  text-align: center;

  .nt-translation {
    width: 60px;
    height: 60px;
    background-image: url('../assets/images/navtoolbar/ico02.png');
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;

    button {
      width: 20px;
      height: 20px;

      &#resize {
        width: 26px;
        height: 26px;
        background-image: url('../assets/images/navtoolbar/ico03.png');
        background-repeat: no-repeat;
        background-size: contain;
        top: 50%;
        left: 50%;
        margin-left: -13px;
        margin-top: -13px;
      }

      &#east {
        top: 50%;
        right: 0;
        margin-top: -10px;
      }

      &#west {
        top: 50%;
        left: 0;
        margin-top: -10px;
      }

      &#south {
        left: 50%;
        bottom: 0;
        margin-left: -10px;
      }

      &#north {
        left: 50%;
        top: 0;
        margin-left: -10px;
      }
    }
  }

  .nt-zoom {
    position: relative;
    height: 120px;
    margin-top: 20px;

    .rule {
      width: 20px;
      height: 104px;
      background-image: url('../assets/images/navtoolbar/ico01.jpg');
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -10px;
    }

    button {
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: contain;

      &#zoomUp {
        left: 50%;
        top: -18px;
        margin-left: -8px;
        background-image: url('../assets/images/navtoolbar/ico04.png');
      }

      &#zoomDowm {
        left: 50%;
        bottom: -4px;
        margin-left: -8px;
        background-image: url('../assets/images/navtoolbar/ico05.png');
      }

      &#site {
        width: 11px;
        height: 11px;
        left: 50%;
        bottom: 20px;
        margin-left: -5px;
        background-image: url('../assets/images/navtoolbar/ico06.png');
      }
    }
  }

  button {
    cursor: pointer;
    position: absolute;
    background: none;
    outline: 0;
    border: 0;
  }
}</style>