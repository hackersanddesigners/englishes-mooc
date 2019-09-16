const ok = require('object-keys')
const ov = require('object-values')
const nc = require('nanocomponent')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const day = require('dayjs')
const rt = require('dayjs/plugin/relativeTime')
const md = new Markdown()
const Txe = require('./texteditor')
const txe = new Txe()

class discussion extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement (state, emit) {
    this.state = state
    this.emit = emit

    const course = ov(state.content).filter(page => page.uid === 'course')[0]
    const user_s = JSON.parse(localStorage.getItem('user_data')).user
    const user = {
      id: user_s.id,
      username: user_s.username,
      name: user_s.name
    }

    return html`
      <div class="psr c12 pt1 pb1 copy">
        <div class="pb1">
          ${raw(md.render(course.content.discussion))}
        </div>

        <div class="posts">
          ${topic(state, emit)}
          ${pagination(state, emit)}
          <button class="${state.components.discussion === undefined ? 'dn ' : 'db '}c12 bt-bk pt1 tac tdu curp" onclick=${loadmore('emit')}>${state.components.loadmore ? 'load more' : 'no more post, refresh still?'}</button>
        </div>

        <div class="psf b0 r0 bgc-wh c6 br-bldb">
          <div class="x xdr xafs c12 pt0-5 pr1 pb0-5 pl1 copy">
            <div class="${state.editor_toggle ? 'db ' : 'dn '}psr pt0-5 c12">
              ${txe.render(state, emit)}
            </div>
            <button onclick=${editor_toggle(emit)} class="fs1 curp mla pl0-5 ${state.editor_toggle ? 'pt0-75' : ''}">${state.editor_toggle ? '↓' : '↑'}</button>
          </div>
        </div>
      </div>
    `

    function editor_toggle (emit) {
      return function () { emit('editor_toggle') }
    }

    function loadmore () {
      return function () { emit('loadmore') }
    }

    function pagination (state, emit) {
      if (state.components.discussion_pag !== undefined) {
        const posts = ov(state.components.discussion_pag.post_stream.posts).filter(post => post.user_deleted === false)
        const stream = ov(state.components.discussion_pag.post_stream.stream)

        get_more_posts(posts, stream)

        return posts.map(function (post, i) {
          return html`
            <div class="post pt1 pb1 bt-bk">
              <div class="x xjb xab">
                <div class="x xac xjc ty-w ty-h br-50 bgc-bk fc-wh">
                  <div class="fs1-2">${post.username.charAt(0)}</div>
                </div>
                <p class="pl1 c8 fc-gk">${post.username}</p>

                <div class="c4 x xdc tar">
                  <p class="fs0-8 fc-gk c12 pb0-25">${date(post.created_at)}</p>
                  ${delbutt()}
                </div>
             </div>

             <div class="pl3 c12">
               ${raw(post.cooked)}
              </div>
            </div>
          `

          function delbutt () {
            if (post.username === user) {
              return html`
                <button onclick=${delete_post(emit)} class="fs0-8 tdu curp">delete</button>
              `
            }
          }

          function delete_post (id) {
            return function () { emit('delete_post', post.id) }
          }
        })
      }
    }

    function get_more_posts (posts, stream) {
      const post_tot = posts.length - 1
      const post_n_l = posts[post_tot].post_number
      const stream_tot = stream.length - 1

      if (post_n_l < stream_tot) {
        emit('post-pag', post_n_l + 1, 'discussion')
        console.log('more post to load')
        state.components.loadmore = true
      } else {
        state.components.loadmore = false
        console.log('no more loading post')
      }
    }

    function date (ts) {
      day.extend(rt)
      return day(ts).fromNow()
    }

    function topic (state, emit) {
      if (state.components.discussion !== undefined) {
        const posts = ov(state.components.discussion.post_stream.posts).filter(post => post.user_deleted === false)
        const stream = ov(state.components.discussion.post_stream.stream)

        get_more_posts(posts, stream)

        return posts.map(function (post, i) {
          return html`
            <div class="post pt1 pb1 bt-bk">
              <div class="x xjb xab">
                <div class="x xac xjc ty-w ty-h br-50 bgc-bk fc-wh">
                  <div class="fs1-2">${post.username.charAt(0)}</div>
                </div>
                <p class="pl1 c8 fc-gk">${post.username}</p>

                <div class="c4 x xdc tar">
                  <p class="fs0-8 fc-gk c12 pb0-25">${date(post.created_at)}</p>
                  ${delbutt()}
                </div>
             </div>

             <div class="pl3 c12">
               ${raw(post.cooked)}
              </div>
            </div>
          `

          function delbutt () {
            if (post.username === user.username) {
              return html`
                <button onclick=${delete_post(emit)} class="fs0-8 tdu curp">delete</button>
              `
            }
          }

          function delete_post (id) {
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
