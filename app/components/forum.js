const ok = require('object-keys')
const nc = require('nanocomponent')
const html = require('choo/html')
const Discussion = require('./discussion')
const discussion = new Discussion()
const Reading = require('./reading')
const reading = new Reading()
const Assignment = require('./assignment')
const assignment = new Assignment()

class forum extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = { }
  }

  createElement (state, data, emit) {
    this.state = state
    this.emit = emit
    this.data = data

    const user = {
      id: data.id,
      username: data.username,
      name: data.name
    }

    return html`
      <div class="psr c12 pt1 pr1 pb1 pl1 copy">
        <div class="z3 psf t0 r0 c6 br-bldb pt1 pr1 pb1 pl1 copy bgc-gy">
          <div class="c12 x xdr xjb pb2">
            <button class="fs1 tdu">${user.name}</button> 
            <button class="curp" onclick=${logout(emit)}>Log out</button>
          </div>

          <div class="x xdr xjb">
            <button class="${state.disc_tab ? 'tdu ' : ''}ft-mn curp" onclick=${disc_tab(emit)}>Discussion</button>
            <button class="${state.todo_tab ? 'tdu ' : ''}ft-mn curp" onclick=${todo_tab(emit)}>Assignments</button>
            <button class="${state.read_tab ? 'tdu ' : ''}ft-mn curp" onclick=${read_tab(emit)}>More Material</button>
          </div>
        </div>

        <div class="posts pt5 pb15">
         ${blob(state, emit)}
        </div>
      </div>
    `

    function logout (emit) {
      return function () { emit('log-out') }
    }

    function disc_tab (emit) {
      return function () { emit('disc-tab') }
    }

    function read_tab (emit) {
      return function () { emit('read-tab') }
    }

    function todo_tab (emit) {
      return function () { emit('todo-tab') }
    }

    function blob (state, emit) {
      if (state.disc_tab === true) {
        return discussion.render(state, emit)
      }

      if (state.todo_tab === true) {
        return assignment.render(state, emit)
      }

      if (state.read_tab === true) {
        return reading.render(state, emit)
      }
    }
  }

  update () {
    return true
  }

  unload () {
    this.state.components.user_id = ''
  }
}

module.exports = forum
