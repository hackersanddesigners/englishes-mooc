const ok = require('object-keys')
const xtend = require('xtend')
const views = require('../views')

function router (site) {
  return function content (state, emitter, app) {
    state.content = { }

    ok(site).forEach(function (path) {
      const page = site[path]
      const view = views[page.template]
      state.content[page.url] = page

      // add sub-pages
      if (ok(page.children).length > 0) {
        ok(page.children).forEach(function (subpath) {
          const subpage = page.children[subpath]
          const subview = views[subpage.template]
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
