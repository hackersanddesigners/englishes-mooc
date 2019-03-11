var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()

class reading extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement(state, emit) {
    this.state = state
    this.emit = emit

    const course = ov(state.content).filter(page => page.uid === 'course')[0]
    console.log(course)
    

    function material () {
      if (state.page === undefined) {
        const page = ov(course.children).filter(page => page.content.status === 'current')[0]
        return page.content.reading
      } else {
        return state.page.content.reading
      }
    }

    return html`
      <div class="c12 pt1 pb1 copy">
        <div class="pb1 bb-bk">
          ${ raw(md.render(course.content.material)) }
        </div>
        <div class="pt1">
        ${ raw(md.render(material())) }
        </div>
      </div>
    `

  }

  update () {
    return true
  }

}

module.exports = reading