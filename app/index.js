var choo = require('choo')
var html = require('choo/html')
var devtools = require('choo-devtools')
var ov = require('object-values')
var css = require('sheetify')
css('./design/index.js')

var app = choo()
app.use(devtools())

app.use(require('./stores/click'))

var views = {
  home: require("./views/main"),
  error: require("./views/notfound")
}

ov(data.children).map(function (page) {
  app.route('/' + page.id, (state, emit) => views[page.intendedTemplate](state, emit))
})

app.route('/', require('./views/main'))
app.route('*', require('./views/notfound'))

if (!module.parent) app.mount('body')
else module.exports = app
