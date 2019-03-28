var html = require('choo/html')

module.exports = view

function view (state, emit) {
  console.log(state)
  
  return html`
    <body class="p1">
      not found
    </body>
  `
}
