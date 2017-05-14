var plt = Bokeh.Plotting;
var request = require('request')
import $ from 'jquery'
var options = 'https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json'
var M = 100;
var moment = require('moment')
// create a data source
function createChart(xx,yy) {
  var source = new Bokeh.ColumnDataSource({
      data: { x: xx, y: yy }
  });
  console.log(source)

  // make the plot and add some tools
  var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
  var p = plt.figure({ title: "Colorful Scatter", tools: tools });
  console.log(p)
  // call the circle glyph method to add some circle glyphs
  var circles = p.circle({ field: "x" }, { field: "y" }, {
      source: source,
      fill_alpha: 0.6,
      line_color: null
  });

  // show the plot

  plt.show(p, "#plot");
}
function callback(info) {
  //var info = JSON.parse(body);
  //console.log(info)
  var xx = info.dataset.data.map((obj) => {
    return moment(obj[0]).toDate()
  })
  console.log(xx)
  var yy = info.dataset.data.map((obj) => {
    return obj[1]
  })
  console.log(yy)
  createChart(xx,yy)
}
var req  = $.get(options)

req.done(function(response) {
  callback(response)
})
// set up some data
