var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()

class assignment extends nc {
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
          <p>Assignments and dates</p>
          <p>Here you can find your assignments and dates for group meetings.</p>
        </div>

        <div class="posts">
         ${ topic() }
        </div>
      </div>
    `

    function topic () {
      if (state.components.assignment !== undefined) {
        return ov(state.components.assignment.post_stream.posts).map(function (post) {
          return html`
            <div class="post p1 bt-bk">
              ${ raw(post.cooked) }
            </div>
          `
        })
      }
    }

  }

  update () {
    return true
  }

}

module.exports = assignment
