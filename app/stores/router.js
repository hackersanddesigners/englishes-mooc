var ok = require('object-keys')
var xtend = require('xtend')
var views = require('../views')

function router (site) {
  return function content (state, emitter, app) {
    state.content = { }

    ok(site).forEach(function (path) {
      var page = site[path]
      var view = views[page.template]
      state.content[page.url] = page

      // add sub-pages
      if (ok(page.children).length > 0) {
        ok(page.children).forEach(function (subpath) {
          var subpage = page.children[subpath]
          var subview = views[subpage.template]
          state.content[subpage.url] = subpage

          app.route(page.uid + '/' + subpage.uid, function (state, emit) {
            return subview(xtend(state, { page: subpage }), emit)
          })
        })
      }

      app.route(page.uid, function (state, emit) {
        return view(xtend(state, { page: page }), emit)
      })

    })

  }
}

module.exports = router
