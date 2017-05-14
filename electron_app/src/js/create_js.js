var plt = Bokeh.Plotting;
var request = require('request')
import $ from 'jquery'
var options = [
  'https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date.gte=20150101&date.lt=20160101&ticker=MSFT,AAPL&api_key=ENTER_API_KEY'
]
var M = 100;
var moment = require('moment')
var zerorpc = require('zerorpc')

// create a data source
function createChart(xx,yy) {
  var source = new Bokeh.ColumnDataSource({
      data: { x: xx, y: yy }
  });

  // make the plot and add some tools
  var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
  var p = plt.figure({ title: "Markowitz Efficient Frontier", tools: tools });
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
  var client = new zerorpc.Client();
  client.connect("tcp://127.0.0.1:4242");
  var xx = info.datatable
  client.invoke("getReturns",xx, function(error, res, more) {
    xx = res
    console.log(xx)
    createChart(xx['stds'],xx['means'])
  })
}
for (var i = 0; i < options.length; i++) {
  var req = $.get(options[i])
  req.done(function(response) {
    console.log(response)
    callback(response)
  })
}

// set up some data
