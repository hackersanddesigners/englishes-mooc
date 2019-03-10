var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var Txe = require('./texteditor')
var txe = new Txe()
var users = require('../stores/users')

class discussion extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement(state, emit) {
    this.state = state
    this.emit = emit

    const course = ov(state.content).filter(page => page.uid === 'course')[0]

    const user_s = JSON.parse(localStorage.getItem('user_data'))
    const user = ok(users).filter(user => user === user_s.user.username)

    return html`
      <div class="psr c12 pt1 pb1 copy">
        <div class="pb1">
          ${ raw(md.render(course.content.discussion)) }
        </div>

        <div class="posts">
          ${ topic(state, emit) }
          ${ pagination(state, emit) }
        </div>

        <div class="psf b0 r0 bgc-wh c6 br-bldb">
          ${ txe.render(state, emit)}
        </div>
      </div>
    `

    function pagination(state, emit) {
      if(state.components.post_pag !== undefined) {
        const posts = ov(state.components.post_pag.post_stream.posts).filter(post => post.user_deleted === false)
        const stream = ov(state.components.post_pag.post_stream.stream)

        loadmore(posts, stream)

        // 2019-03-05T10:35:55.758Z

        return posts.map(function (post, i) {
          return html`
            <div class="post x xjb pt1 pb1 bt-bk">
              <div class="ty-w ty-h br-50 bgc-bk fc-wh">${ post.username.charAt(0) }</div>

              <div style="width: 90%">
                <div class="x xdr xjb">
                  <p class="c9 fc-gk">${ post.username }</p>
                  <p class="c3 fc-gk">${ date() }</p>
                  ${ delbutt() }
                </div>
                <div>
                  ${ raw(post.cooked) }
                </div>
              </div>
            </div>
          `

          function date() {
            return Date.parse(post.created_at)
          }

          function delbutt () {
            if (post.username === user[0]) {
              return html`
                <button onclick=${ delete_post(emit) } class="curp">delete</button>
              `
            }
          }

          function delete_post(id) {
            return function () { emit('delete_post', post.id) }
          }

        })
      } else {
        return html`
          <div class="pt1 pb1 bt-bk">
            <p>loading...</p>
          </div>
        `
      }

    }
  }

  update () {
    return true
  }

}

module.exports = discussion
