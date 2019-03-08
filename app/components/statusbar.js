var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var Video = require('./video')
var video = new Video()

class statusbar extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = { }
  }

  createElement(state, data, emit) {
    this.state = state
    this.emit = emit
    this.data = data

    return html`
      <div class="${ state.status_toggle ? 'md-db c12 ' : 'dn ' }pt1 pr1 pb1 pl1">
        ${ items() }
      </div>
    `

    function items () {
      return ov(data.children).map(function (item) {
        return html`
          <div class="x xdr xjb pt1">
            <div class="video tac pb1 c12">
              ${ video.render(state, item.content.pitch_url, emit) }
              <a href="${ item.url }" class="ft-mn fs0-8 fc-bk tdn">${ item.content.title }</a>
              <p class="ft-mn fs0-8 pt0-5 pb0">${ item.content.duration }</p>
            </div>
            ${ status() }
          </div>
        `

        function status () {
          if(item.content.status === 'current') {
            return html`
              <div class="pl1">+</div>
            `
          } else if(item.content.status === 'done') {
            return html`
              <div class="pl1">x</div>
            `
          } else if(item.content.status === 'upcoming') {
            return html`
              <div class="pl1">...</div>
            `
          }
        }

      })
    }

  }

  update () {
    return true
  }

}

module.exports = statusbar
