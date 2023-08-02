<template>
  <div class="map-mian">
    <div class="map" id="map">
    </div>
  </div>
</template>

<script>
import remoteLoad from './remoteLoad.js'
export default {
  name: 'MapMain',
  props: {
    // list: {
    //   type: Array,
    //   default() {
    //     return []
    //   },
    // },
  },
  watch: {
    // list: {
    //   immediate: true,
    //   handler: function () {
    //     this.loadAmap()
    //   }
    // },
  },
  data() {
    return {
      list: [
        // {
        //   title: '北京',
        //   position: [116.363449, 39.954759],
        //   type: 1
        // },
        // {
        //   title: 'marker2',
        //   position: [111.345455, 35.366442],
        //   type: 1
        // },
        // {
        //   title: 'marker3',
        //   position: [117.365963, 35.759674],
        //   type: 2
        // },
        // {
        //   title: 'marker5',
        //   position: [116.407394, 39.904211],
        //   type: 4
        // },
        // {
        //   title: 'marker6',
        //   position: [113.982174, 27.892263],
        //   type: 5
        // }
      ],
      markerData: {},
      MapKey: '69011168b7d13fe811fe35e98a7d1c80'
    }
  },
  created() {
    this.loadAmap()
  },
  methods: {
    async loadAmap() {
      if (window.AMap && window.AMapUI) {
        this.initMap()
      } else {
        await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${this.MapKey}`)
        await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }
    },
    initMap() {
      // 加载 PositionPicker，loadUI 的路径参数为模块名中 'ui/' 之后的部分
      let AMapUI = this.AMapUI = window.AMapUI
      let AMap = this.AMap = window.AMap
      // eslint-disable-next-line no-unused-vars
      AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        let mapConfig = {
          zoom: 5,
          // layers: [new this.AMap.TileLayer.Satellite()], // 卫星图
          center: [116.407394, 39.904211],
        }
        let map = new AMap.Map('map', mapConfig)

        // 标注
        let marker = new AMap.Marker({
          position: new AMap.LngLat(116.397266, 39.909347),
          offset: new AMap.Pixel(-10, -10),
          icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
          title: '北京'
        })
        map.add([marker])

        map.on('click', (e) => {
          console.log(e, e.lnglat)
        })

      })
    }
  }
}
</script>

<style lang="scss" scope>
.map-mian {
  width: 100%;
  height: 100%;

  .map {
    width: 100%;
    height: 100%;
  }

  .amap-info-sharp {
    display: none;
  }
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}</style>
