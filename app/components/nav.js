module.exports = nav

var html = require('choo/html')
var ov = require('object-values')

function nav (state, emit) {
  const pages = data.children

  return html`
    <nav class="w100 x xdr xjb">${ list() }</nav>
  `

  function list () {
    return ov(pages).map(function (item) {
      return html`
        <a href="${ item.url }">${ item.content.title }</a>
      `
    })
  }
}
