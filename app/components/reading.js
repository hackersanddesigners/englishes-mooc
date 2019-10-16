const ov = require('object-values')
const nc = require('nanocomponent')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const md = new Markdown()

class reading extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement (state, emit, course, module) {
    this.state = state
    this.emit = emit
    this.course = course
    this.module = module

    return html`
      <div class="c12 pt1 pb1 copy">
        <div class="pb1 bb-bk">
          ${raw(md.render(course.content.material))}
        </div>
        <div class="pt1">
        ${raw(md.render(module.content.reading))}
        </div>
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = reading
