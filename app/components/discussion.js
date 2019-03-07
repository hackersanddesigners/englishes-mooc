var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var ti = require('./textinput')

class discussion extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement(state, emit) {
    this.state = state
    this.emit = emit

    return html`
      <div class="c12 pt1 pr1 pb1 pl1 copy">
        <div class="pb1">
          <p>Feedback</p>
          <p>Do you have questions about the assignment or the content of this module? Share it in the group on this note board or contact Nicoline van Harskamp via englishes.mooc@gmail.com</p>
        </div>

        <div class="posts">
         ${ topic() }
        </div>

        <div class="">
          ${ ti(state, emit)}
        </div>
      </div>
    `

    function topic () {
      if (state.components.discussion !== undefined) {
        return ov(state.components.discussion.post_stream.posts).map(function (post) {
          return html`
            <div class="post p1 bt-bk">
              <div class="x xjsb">
                <p class="c9">${ post.username }</p>
                <p class="c3">${ date() }</p>
              </div>
              ${ raw(post.cooked) }
            </div>
          `
          
          function date() {
            return Date.parse(post.created_at)
          }

        })
      }
    }

  }

  update () {
    return true
  }

}

module.exports = discussion
