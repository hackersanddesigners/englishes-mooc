const html = require('choo/html')
const ov = require('object-values')

function nav (state, emit) {
  const pages = ov(data.children).filter(page => page.id !== 'hkw')

  return html`
    <nav class="c12 x xdc sm-pt0 md-pt4-7 pb1 pr1 pl1 tac">
      <button class="ft-bd fs2-4 pb1 md-dn curp ${state.nav_toggle ? 'ft-mn ' : 'ft-mn '}" onclick=${nav_toggle(emit)}>${state.nav_toggle ? 'Menu' : 'x'}</button>
      <div class="${state.nav_toggle ? 'dn' : 'db'} md-db">
        ${list()}
      </div>
      <button class="psf b0 r0 pt0-25 pb0-25 mb2 mr2 sm-bt bgc-wh bxsh-a curp z4" onclick=${login}>Log in</button>
    </nav>
  `

  function nav_toggle (emit) {
    return function () { emit('nav_toggle') }
  }

  function list () {
    const list = ov(pages).filter(page => page.uid !== 'course')
    return list.map(function (item, i) {
      return html`
        <button class="nav-bt c12 fs1-5 fc-bk tdn pb1 curp" onclick=${section(item, emit)}>${item.content.title}</button>
      `

      function section (item, emit) {
        return function () { emit('section', item) }
      }
    })
  }

  function login () {
    emit('login')
  }
}

module.exports = nav
