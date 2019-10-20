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
      // replace partial file-urls added by kirby drag'n'drop md,
      // w/ absolute urls

      const md_file = require('markdown-it')({
        replaceLink: function (link, env) {
          if (link.includes('http') === false) {
            console.log(link)
            const fn = ov(module.files).filter(file => file.filename === link)
            console.log(fn, fn.length)

            if (fn.length > 0) {
              return fn[0].url
            }
          } else {
            return link
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
