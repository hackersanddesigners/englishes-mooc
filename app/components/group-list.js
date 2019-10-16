const ok = require('object-keys')
const ov = require('object-values')
const nc = require('nanocomponent')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const md = new Markdown()

class group_list extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement (state, emit) {
    this.state = state
    this.emit = emit

    const course = ov(state.content).filter(page => page.uid === 'course')[0]
    return html`
      <div class="psr c12 pt1 pb1 copy">
        <div class="pb1">
          ${raw(md.render(course.content.group_list))}
        </div>
      </div>
    `
  }

  update () {
    return true
  }
}

module.exports = group_list
