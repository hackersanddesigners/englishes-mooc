var choo = require('choo')
var html = require('choo/html')
var devtools = require('choo-devtools')
var ok = require('object-keys')
var ov = require('object-values')
var css = require('sheetify')
css('./design/index.js')
css('./design/design.css')

var app = choo()
app.use(devtools())

app.use(require('./stores/click'))

var views = {
  about: require("./views/about"),
  course: require("./views/course"),
  module: require("./views/module"),
  chapter: require("./views/chapter"),
  hkw: require("./views/preview"),
  signup: require("./views/signup"),
  error: require("./views/notfound")
}

ov(data.children).map(function (page) {
  app.route('/' + page.id, (state, emit) => views[page.template](state, emit))
})

app.route('/', require('./views/main'))
app.route('*', require('./views/notfound'))

if (!module.parent) app.mount('body')
else module.exports = app
