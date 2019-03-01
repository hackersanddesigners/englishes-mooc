var html = require('choo/html')
var ov = require('object-values')

function nav (state, emit) {
  const pages = data.children

  return html`
    <nav class="vh100 c3 x xdc bl-rd pt4-7 pb1 pr1 pl1 tac">
      ${ list() }
      <button class="sm-bt pt0-25 pb0-25 bxsh-a curp" onclick=${ login }>Log in</button>
    </nav>
  `

  function list () {
    return ov(pages).filter(page => page.uid !== 'course').map(function (item) {
      return html`
        <button class="fs1-5 fc-bk tdn pb1 curp" onclick=${ section(item, emit) }>${ item.content.title }</button>
      `

      function section (item, emit) {
        return function () { emit('section', item) }
      }

    })
  }

  function login() {
    emit('login')
  }

}

module.exports = nav
