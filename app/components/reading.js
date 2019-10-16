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
        ${reading_links(module.content.reading)}
        </div>
      </div>
    `

    function reading_links (data) {
      // replace malformatted `href`,
      // eg <a href="<filename>"> by
      // matching <filename> to page.files[i].filename
      // and replace old href w/ new, correct one

      const md_file = require('markdown-it')({
        replaceLink: function (link, env) {
          const fn = ov(module.files).filter(file => file.filename === link)[0]
          if (fn !== undefined) {
            return fn.url
          }
        }
      }).use(require('markdown-it-replace-link'))

      return html`
        ${raw(md_file.render(data))}
    `
    }
  } 

  update () {
    return true
  }
}

module.exports = reading
