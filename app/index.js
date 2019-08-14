const choo = require('choo')
const devtools = require('choo-devtools')
const css = require('sheetify')
css('./design/index.js')
css('./design/design.css')

const app = choo()
app.use(devtools())

app.use(require('./stores/click'))

app.use(require('./stores/forum'))
app.use(require('./stores/post-pag'))

app.use(require('./stores/content')(data.children))

app.use(require('./stores/redirect'))

app.route('/', require('./views/main'))
app.route('*', require('./views/notfound'))

if (!module.parent) app.mount('body')
else module.exports = app
