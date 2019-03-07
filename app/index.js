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
app.use(require('./stores/topic'))
app.use(require('./stores/discussion'))
app.use(require('./stores/assignment'))

app.use(require('./stores/router')(data.children))

app.route('/', require('./views/main'))
app.route('*', require('./views/notfound'))

if (!module.parent) app.mount('body')
else module.exports = app
