(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c846e7fa"],{"159b":function(e,t,i){var a=i("da84"),s=i("fdbc"),r=i("17c2"),n=i("9112");for(var c in s){var o=a[c],l=o&&o.prototype;if(l&&l.forEach!==r)try{n(l,"forEach",r)}catch(h){l.forEach=r}}},"17c2":function(e,t,i){"use strict";var a=i("b727").forEach,s=i("a640"),r=i("ae40"),n=s("forEach"),c=r("forEach");e.exports=n&&c?[].forEach:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}},"2ffe":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"map-container"}},[i("div",{staticStyle:{position:"absolute",right:"50px",top:"50px","z-index":"999",width:"200px"}},[i("el-tree",{ref:"tree2",attrs:{data:e.treeData2,"show-checkbox":"","node-key":"id","highlight-current":""},on:{"check-change":e.handleCheckChange2}}),i("hr"),i("el-tree",{ref:"tree",attrs:{data:e.treeData,props:e.defaultProps,"show-checkbox":"","node-key":"id","highlight-current":""},on:{"check-change":e.handleCheckChange}})],1)])},s=[],r=(i("4160"),i("d81d"),i("ac1f"),i("1276"),i("159b"),i("afaa")),n={name:"MapServer",data:function(){return{SF311Layer:null,DamageAssessmentLayer:null,haveSublayers:null,defaultProps:{children:"children",label:"label"},treeData2:[{label:"StoryMapPlaces5",id:"StoryMapPlaces5"},{label:"StoryMapPlaces7",id:"StoryMapPlaces7"}],treeData:[{label:"Cities",id:0},{label:"Highways",id:1},{label:"States",id:2},{label:"Counties",id:3}],map:"",gisConstructor:{},gisModules:["esri/layers/ArcGISTiledMapServiceLayer","esri/layers/ArcGISDynamicMapServiceLayer","esri/geometry/Extent","esri/map"]}},mounted:function(){this.init()},methods:{handleCheckChange2:function(){var e=this,t=this.$refs.tree2.getCheckedKeys(),i=this.treeData2.map((function(e){return e.label}));i.forEach((function(t){var i=e.map.getLayer(t);i.setVisibility(!1)})),t.forEach((function(t){var i=e.map.getLayer(t);i.setVisibility(!0)}))},handleCheckChange:function(){var e=this.$refs.tree.getCheckedKeys(),t=this.map.getLayer("DamageAssessment");t.setVisibility(!1),t.setVisibility(!0),t.setVisibleLayers(e)},loadLayersFun:function(){for(var e=[{url:"https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces5/MapServer",id:"StoryMapPlaces5",opacity:1,visible:!1,type:"dynamic"},{url:"https://sampleserver6.arcgisonline.com/arcgis/rest/services/StoryMaps/StoryMapPlaces7/MapServer",id:"StoryMapPlaces7",opacity:1,visible:!1,type:"dynamic"},{url:"https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",id:"DamageAssessment",opacity:.5,visible:!1,type:"dynamic"}],t=0;t<e.length;t++)if("dynamic"===e[t].type){var i=new this.gisConstructor.ArcGISDynamicMapServiceLayer(e[t].url,{id:e[t].id,opacity:e[t].opacity||1,visible:e[t].visible});this.map.addLayer(i)}},mapClickFun:function(){this.map.on("click",(function(e){console.log(e)}))},init:function(){Object(r["loadCss"])("https://js.arcgis.com/3.32/esri/css/esri.css"),Object(r["loadModules"])(this.gisModules,{url:"https://js.arcgis.com/3.32/"}).then(this.initMap).then(this.loadLayersFun).then(this.mapClickFun)},initMap:function(e){for(var t in e){var i=this.gisModules[t].split("/").pop();this.gisConstructor[i]=e[t]}this.map=new this.gisConstructor.map("map-container",{basemap:"osm",logo:!1,slider:!0});var a={xmin:-117.1839455,ymin:32.68087830000002,xmax:-117.15035189999998,ymax:32.732100979999984};this.map.setExtent(new this.gisConstructor.Extent(a.xmin,a.ymin,a.xmax,a.ymax))}}},c=n,o=i("2877"),l=Object(o["a"])(c,a,s,!1,null,null,null);t["default"]=l.exports},4160:function(e,t,i){"use strict";var a=i("23e7"),s=i("17c2");a({target:"Array",proto:!0,forced:[].forEach!=s},{forEach:s})},a640:function(e,t,i){"use strict";var a=i("d039");e.exports=function(e,t){var i=[][e];return!!i&&a((function(){i.call(null,t||function(){throw 1},1)}))}},fdbc:function(e,t){e.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);