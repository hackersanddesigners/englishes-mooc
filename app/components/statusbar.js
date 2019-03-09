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
          const clocks = {
            'clock-01': '<svg width="28" height="28"><g stroke="#231F20" stroke-width=".86" fill="none" fill-rule="evenodd"><path d="M14.31 27.55c7.257 0 13.14-5.883 13.14-13.14 0-7.257-5.883-13.14-13.14-13.14-7.257 0-13.14 5.883-13.14 13.14 0 7.257 5.883 13.14 13.14 13.14zM14.31 3.99v11.42M23.53 15.41h-9.65"/></g></svg>',
            'clock-02': '<svg width="28" height="28"><g transform="translate(1)" stroke="#231F20" stroke-width=".86" fill="none" fill-rule="evenodd"><circle cx="13.31" cy="13.93" r="13.14"/><path d="M5.62 6.74l8.87 7.19M7.97 20.45l6.83-6.82"/></g></svg>',
            'clock-03': '<svg width="28" height="28"><g transform="translate(1 1)" stroke="#231F20" stroke-width=".86" fill="none" fill-rule="evenodd"><circle cx="13.31" cy="13.3" r="13.14"/><path d="M5.79 20.82l8.07-8.07M7.35 6.23l6.82 6.82"/></g></svg>',
            'clock-04': '<svg width="28" height="28"><g transform="translate(1)" stroke="#231F20" stroke-width=".86" fill="none" fill-rule="evenodd"><circle cx="13.31" cy="13.66" r="13.14"/><path d="M5.24 7.86l8.07 8.08M19.83 9.42l-6.82 6.82"/></g></svg>'
          }

          let random_clock = (obj) => {
            var keys = ok(obj)
            return obj[keys[ keys.length * Math.random() << 0]];
          }

          if(item.content.status === 'current') {
            return html`
              <div class="pl1">
                <svg width="13" height="2"><text transform="translate(-1 -17)" fill="#231F20" fill-rule="evenodd" font-family="Helvetica" font-size="18.58"><tspan x="0" y="18.63">...</tspan></text></svg>
              </div>
            `
          } else if(item.content.status === 'done') {
            return html`
              <div class="pl1">
                <svg width="28" height="20"><g stroke="#231F20" stroke-width=".75" fill="none" fill-rule="evenodd"><path d="M.03 10.48l8.8 8.79M27.2.27l-18.76 19"/></g></svg>
              </div>
            `
          } else if(item.content.status === 'upcoming') {
            return html`
              <div class="pl1">${ raw(random_clock(clocks)) }</div>
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
