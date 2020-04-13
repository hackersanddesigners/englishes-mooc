const nc = require('nanocomponent')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Markdown = require('markdown-it')
const md = new Markdown()
const ov = require('object-values')
const Discussion = require('./discussion')
const discussion = new Discussion()
const GroupList = require('./group-list')
const group_list = new GroupList()
const Reading = require('./reading')
const reading = new Reading()

class forum extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
    this.data = { }
  }

  createElement (state, emit, user) {
    this.state = state
    this.emit = emit
    this.user = user

    const page = ov(state.content).filter(page => page.uid === 'course')[0]
    let module
    if (state.route !== '/') {
      module = state.page
    } else {
      module = ov(page.children).filter(module => module.content.status === 'current')[0]
    }

    if (state.components.discussion !== undefined && state.components.discussion === null) {
      return html`
        <div class="psr c12 pt1 pr1 pb1 pl1 copy">
          <div class="c12 x xdr xjb pb2">
             <button class="fs1 tdu">${user.username}</button> 
             <button class="curp" onclick=${logout(emit)}>Log out</button>
          </div>
          <div class="x xdr xjb">
            ${raw(md.render(page.content.no_module))}
          </div>
        </div>
      `
    } else if (state.components.discussion !== undefined) {
      return html`
        <div class="psr c12 pt1 pr1 pb1 pl1 copy">
          <div class="z3 psf t0 r0 c6 br-bldb pt1 pr1 pb1 pl1 copy bgc-gy">
            <div class="c12 x xdr xjb pb2">
              <button class="fs1 tdu">${user.username}</button> 
              <button class="curp" onclick=${logout(emit)}>Log out</button>
            </div>

            <div class="x xdr xjb">
              <button class="${state.disc_tab ? 'tdu ' : ''}ft-mn curp" onclick=${disc_tab(emit)}>Discussion</button>
              <button class="${state.group_tab ? 'tdu ' : ''}ft-mn curp" onclick=${group_tab(emit)}>Group</button>
              <button class="${state.read_tab ? 'tdu ' : ''}ft-mn curp" onclick=${read_tab(emit)}>More Material</button>
            </div>
          </div>

          <div class="posts pt5 pb15">
           ${blob(state, emit)}
          </div>
        </div>
      `
    } else {
      return html`
        <div class="psr c12 pt1 pr1 pb1 pl1 copy">
          <p>loading...</p>
          <button class="curp" onclick=${logout(emit)}>Log out</button>
        </div>
      `
    }

    function logout (emit) {
      return function () { emit('log-out') }
    }

    function disc_tab (emit) {
      return function () { emit('disc-tab') }
    }

    function group_tab (emit) {
      return function () { emit('group-tab') }
    }

    function read_tab (emit) {
      return function () { emit('read-tab') }
    }

    function blob (state, emit) {
      if (state.disc_tab === true) {
        return discussion.render(state, emit, page, module)
      }
      if (state.group_tab === true) {
        return group_list.render(state, emit, page, module)
      }
      if (state.read_tab === true) {
        return reading.render(state, emit, page, module)
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
