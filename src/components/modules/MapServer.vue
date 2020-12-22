<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-11 09:06:28
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-12-22 18:02:34
 * @Descripttion: 加载 ArcGIS REST Services
--> 

<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div
         style="position:absolute;right:50px;top:50px;z-index:999;width:200px;">
      <el-tree :data="treeData2"
               show-checkbox
               node-key="id"
               @check-change="handleCheckChange2"
               ref="tree2"
               highlight-current>
      </el-tree>
      <hr>
      <el-tree :data="treeData"
               :props="defaultProps"
               show-checkbox
               node-key="id"
               @check-change="handleCheckChange"
               ref="tree"
               highlight-current>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { loadCss, loadModules } from 'esri-loader'
export default {
  name: 'MapServer',
  data() {
    return {
      SF311Layer: null,
      DamageAssessmentLayer: null,
      haveSublayers: null,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      treeData2: [
        {
          label: 'StoryMapPlaces5',
          id: 'StoryMapPlaces5',
        },
        {
          label: 'StoryMapPlaces7',
          id: 'StoryMapPlaces7',
        },
      ],
      treeData: [
        {
          label: 'Cities',
          id: 0,
        },
        {
          label: 'Highways',
          id: 1,
        },
        {
          label: 'States',
          id: 2,
        },
        {
          label: 'Counties',
          id: 3,
        },
      ],
      map: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/SpatialReference',
        'esri/Color',
        'esri/symbols/TextSymbol',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/Font',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/geometry/geometryEngine',
        'esri/layers/GraphicsLayer', // 图形图层
        'esri/graphic', // 图形
        'dojo/_base/declare',
        'esri/layers/FeatureLayer', // 要素图层服务
        'esri/layers/ArcGISTiledMapServiceLayer', // 切片图层服务
        'esri/layers/ArcGISDynamicMapServiceLayer', // 动态图层服务
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
     * @name: 单个图层切换
     */
    handleCheckChange2() {
      let checked = this.$refs.tree2.getCheckedKeys()
      let allData = this.treeData2.map(item => item.label)
      allData.forEach(item => {
        let layer = this.map.getLayer(item)
        layer.setVisibility(false)
      })
      checked.forEach(item => {
        let layer = this.map.getLayer(item)
        layer.setVisibility(true)
      })
    },

    /**
     * @name: 图层切换（子图层）
     */
    handleCheckChange() {
      let checked = this.$refs.tree.getCheckedKeys()
      let layer = this.map.getLayer('DamageAssessment')
      layer.setVisibility(false)
      layer.setVisibility(true)
      layer.setVisibleLayers(checked)
    },

    /**
     * @name: 加载图层
     */
    loadLayersFun() {
      const layerList = [
        {
          url:
            'https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces5/MapServer',
          id: 'StoryMapPlaces5',
          opacity: 1,
          visible: false,
          type: 'dynamic',
        },
        {
          url:
            'https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces7/MapServer',
          id: 'StoryMapPlaces7',
          opacity: 1,
          visible: false,
          type: 'dynamic',
        },
        {
          url:
            'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
          id: 'DamageAssessment',
          opacity: 0.5,
          visible: false,
          type: 'dynamic',
        },
      ]
      layerList.forEach(item => {
        if (item.type === 'dynamic') {
          let layer = new this.gisConstructor.ArcGISDynamicMapServiceLayer(
            item.url,
            {
              id: item.id,
              opacity: item.opacity || 1,
              visible: item.visible,
            }
          )
          this.map.addLayer(layer)
        }
      })

      let layer = this.map.getLayer('DamageAssessment')
      console.log(layer.layerInfos) // 通过 layerInfos 获取子服务失败，需要判断图层是否加载完成
      if (layer.loaded) {
        console.log(layer.layerInfos)
      } else {
        // eslint-disable-next-line no-undef
        dojo.connect(layer, 'onLoad', (layer) => {
          // 子图层数据加载完成可以动态设置 treeData
          console.log(layer.layerInfos)
        })
      }

      // 使用 FeatureLayer 做高亮效果
      let highLightLayer = new this.gisConstructor.GraphicsLayer({
        id: '高亮图层'
      })
      this.map.addLayer(highLightLayer)

      let facetServerLayer = new this.gisConstructor.FeatureLayer('https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3', {
        mode: this.gisConstructor.FeatureLayer.MODE_ONDEMAND, // MODE_SNAPSHOT（全部请求），MODE_ONDEMAND（按需请求）
        outFields: ["*"],
        opacity: 0,
        // geometry: '13176890.213824289,4480557.8370849015,13178644.95887128,4481818.078861634'
      })
      this.map.addLayer(facetServerLayer)
      facetServerLayer.on('mouse-over', evt => {
        let layerChecked = this.$refs.tree.getCheckedKeys()
        if (evt.graphic && layerChecked.indexOf(3) > -1) {
          let data = evt.graphic.attributes
          let geometry = evt.graphic.geometry
          let fillSymbol = new this.gisConstructor.SimpleFillSymbol().setColor(new this.gisConstructor.Color([255, 0, 0, 0.3]))
          fillSymbol.setOutline(new this.gisConstructor.SimpleLineSymbol(this.gisConstructor.SimpleLineSymbol.STYLE_SOLID, new this.gisConstructor.Color([255, 0, 0]), 3))
          let fillGraphic = new this.gisConstructor.graphic(geometry, fillSymbol)
          highLightLayer.add(fillGraphic)

          let centerPoint = geometry.getExtent().getCenter()
          let textSymbol = new this.gisConstructor.TextSymbol(
            data.name,
            new this.gisConstructor.Font('12px'),
            new this.gisConstructor.Color([255, 0, 0])
          )
          let holoColor = this.gisConstructor.Color('#fff')
          textSymbol.setHaloColor(holoColor).setHaloSize(2)
          let textGraphic = new this.gisConstructor.graphic(
            centerPoint,
            textSymbol,
            data
          )
          highLightLayer.add(textGraphic)
        } else {
          highLightLayer.clear()
        }
      })
      facetServerLayer.on('mouse-out', () => {
        highLightLayer.clear()
      })

    },

    /**
     * @name: 地图点击事件
     */
    mapClickFun() {
      this.map.on('click', event => {
        console.log(event)
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
        .then(this.loadLayersFun)
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
      // let extent = {
      //   xmin: -117.1839455,
      //   ymin: 32.68087830000002,
      //   xmax: -117.15035189999998,
      //   ymax: 32.732100979999984,
      // }
      let extent = {
        xmin: -178.217598382,
        ymin: 18.921786345999976,
        xmax: -66.96927110500002,
        ymax: 71.40623554799998,
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