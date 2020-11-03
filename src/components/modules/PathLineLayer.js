export default {
    /**
     * @name: 绘制轨迹
     * @param {map} 
     * @param {gisConstructor}
     * @param {options}
     */
    pathLineLayer(map, gisConstructor, options) {
        options.map = map
        // eslint-disable-next-line no-undef
        dojo.declare('MeasureLayer', gisConstructor.GraphicsLayer, {
            _map: '',
            constructor: function (options) {
                this._map = map
                this.data = options.data || []
                this.id = "历史轨迹"
                this.map = options.map || this.getMap()
                this.map.infoWindow.hide()
                if (options.data.length > 0) {
                    this.showSymbol(options.data)
                }
            },
            showSymbol: function (list) {
                this.clear();
                var path = [],
                    xmin = 0,
                    ymin = 0,
                    xmax = 0,
                    ymax = 0;
                for (var i = 0; i < list.length; i++) {
                    path.push([list[i]["x"], list[i]["y"]]);
                    if (list[i]["x"] > xmax) {
                        xmax = list[i]["x"];
                    }
                    if (list[i]["x"] < xmin || xmin == 0) {
                        xmin = list[i]["x"];
                    }
                    if (list[i]["y"] > ymax) {
                        ymax = list[i]["y"];
                    }
                    if (list[i]["y"] < ymin || ymin == 0) {
                        ymin = list[i]["y"];
                    }
                }
                var line = {
                    geometry: {
                        "paths": [path],
                        "spatialReference": {
                            "wkid": 4490
                        }
                    },
                    "symbol": {
                        "color": new gisConstructor.Color([255, 0, 0, 1]),
                        "width": 2,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    }
                };
                // console.log(line)
                this.add(new gisConstructor.graphic(line))
                //console.log(xmin+","+ymin+","+xmax+","+ymax);
                console.log(this)
                //地图缩放
                this._map.setExtent(new gisConstructor.Extent(xmin - 0.01, ymin - 0.01, xmax + 0.01, ymax + 0.01, new gisConstructor.SpatialReference({
                    wkid: 4490
                })));

            }
        })
    }
}