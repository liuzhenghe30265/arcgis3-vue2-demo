(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-935b8568"],{3850:function(t,e,i){"use strict";var o=i("c014"),s=i.n(o);s.a},c014:function(t,e,i){},e9cb:function(t,e,i){"use strict";i.r(e);var o=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},s=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"map-container"}},[i("div",{attrs:{id:"HomeButton"}}),i("div",{attrs:{id:"LocateButton"}}),i("div",{staticClass:"navigation-toolbar",attrs:{id:"navigation-toolbar"}},[i("div",{staticClass:"nt-translation"},[i("button",{attrs:{id:"resize"}}),i("button",{attrs:{id:"east"}}),i("button",{attrs:{id:"west"}}),i("button",{attrs:{id:"south"}}),i("button",{attrs:{id:"north"}})]),i("div",{staticClass:"nt-zoom"},[i("button",{staticClass:"rule",attrs:{id:"rule"}}),i("button",{attrs:{id:"site"}}),i("button",{attrs:{id:"zoomUp"}}),i("button",{attrs:{id:"zoomDowm"}})])])])}],a=(i("d81d"),i("ac1f"),i("1276"),i("afaa")),r={name:"InitMap",data:function(){return{navToolbar:null,map:"",gisConstructor:{},gisModules:["esri/geometry/webMercatorUtils","esri/geometry/Point","esri/SpatialReference","esri/tasks/GeometryService","esri/tasks/ProjectParameters","esri/toolbars/navigation","dojo/_base/declare","esri/dijit/OverviewMap","esri/dijit/Scalebar","esri/dijit/LocateButton","esri/dijit/HomeButton","esri/layers/OpenStreetMapLayer","esri/layers/ArcGISTiledMapServiceLayer","esri/geometry/Extent","esri/map"]}},mounted:function(){this.init()},methods:{mapClickFun:function(){var t=this;this.map.on("click",(function(e){console.log(e),console.log(t.gisConstructor.webMercatorUtils.xyToLngLat(e.mapPoint.x,e.mapPoint.y)),console.log([e.mapPoint.getLongitude(),e.mapPoint.getLatitude()]);var i=new t.gisConstructor.ProjectParameters;i.geometries=[e.mapPoint],i.outSR=new t.gisConstructor.SpatialReference({wkid:4490}),i.transformForward=!0;var o=new t.gisConstructor.GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");o.project(i,(function(t){console.log(t[0])}))}))},init:function(){Object(a["loadCss"])("https://js.arcgis.com/3.32/esri/css/esri.css"),Object(a["loadModules"])(this.gisModules,{url:"https://js.arcgis.com/3.32/"}).then(this.initMap).then(this.mapClickFun)},initMap:function(t){var e=this;for(var i in t){var o=this.gisModules[i].split("/").pop();this.gisConstructor[o]=t[i]}this.map=new this.gisConstructor.map("map-container",{basemap:"osm",zoom:12,logo:!1,slider:!0,isZoomSlider:!0,isDoubleClickZoom:!1,autoResize:!0});var s={xmin:-117.1839455,ymin:32.68087830000002,xmax:-117.15035189999998,ymax:32.732100979999984};this.map.setExtent(new this.gisConstructor.Extent(s.xmin,s.ymin,s.xmax,s.ymax));var a=new this.gisConstructor.HomeButton({map:this.map},"HomeButton");a.startup();var r=new this.gisConstructor.LocateButton({map:this.map},"LocateButton");r.startup();new this.gisConstructor.Scalebar({map:this.map,scalebarUnit:"metric"});for(var n=document.getElementById("navigation-toolbar"),c=n.querySelectorAll("button"),l="",m="",u="",p=40,g=3,d=0;d<c.length;d++)"site"===c[d].getAttribute("id")&&(l=c[d],l.style.bottom=this.map.getLevel()*g+p+"px"),"rule"===c[d].getAttribute("id")&&(m=c[d],u=m.getBoundingClientRect().top),c[d].onclick=function(t){var i=t.target.getAttribute("id");switch(i){case"resize":e.map.setExtent(new e.gisConstructor.Extent(s.xmin,s.ymin,s.xmax,s.ymax)),l.style.bottom=e.map.getLevel()*g+p+"px";break;case"east":e.map.panRight();break;case"west":e.map.panLeft();break;case"north":e.map.panDown();break;case"south":e.map.panUp();break;case"zoomUp":e.map.setLevel(e.map.getLevel()+1),l.style.bottom=e.map.getLevel()*g+p+"px";break;case"zoomDowm":e.map.setLevel(e.map.getLevel()-1),l.style.bottom=e.map.getLevel()*g+p+"px";break;case"rule":console.log(t.clientY),console.log(u);break}}}}},n=r,c=(i("3850"),i("2877")),l=Object(c["a"])(n,o,s,!1,null,null,null);e["default"]=l.exports}}]);