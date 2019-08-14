const html = require('choo/html')

function view (state, emit) {
  console.log(state)
 
  return html`
    <body class="p1">
      not found
    </body>
  `
}

module.exports = view
