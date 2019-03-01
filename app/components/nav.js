module.exports = nav

var html = require('choo/html')
var ov = require('object-values')

function nav (state, emit) {
  const pages = data.children

  return html`
    <nav class="c3 x xdc bl-rd pt4-7 pb1 pr1 pl1 tac">${ list() }</nav>
  `

  function list () {
    return ov(pages).map(function (item) {
      return html`
        <button class="fs1-5 fc-bk tdn pb1 curp" onclick=${ oo(item, emit) }>${ item.content.title }</button>
      `

      function oo (item, emit) {
        return function () { emit('toggle', item) }
      }

    })
  }

}
