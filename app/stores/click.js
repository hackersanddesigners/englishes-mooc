const ok = require('object-keys')
const ov = require('object-values')
const xhr_call = require('../components/xhr-call.js')
const users = require('./users.json')
const fetch_topic = require('../components/fetch-topic')

function clickhandle (state, emitter) {
  state.sidebar = false
  state.login = false
  state.disc_tab = true
  state.read_tab = false
  state.todo_tab = false
  state.modules = []
  state.nav_toggle = true
  state.status_toggle = false
  state.editor_toggle = true

  const modules = data.children.course.children
  ov(modules).map(function (module) {
    state.modules.push(true)
  })

  emitter.on('mod_toggle', (module) => {
    state.modules[module] =! state.modules[module]
    emitter.emit('render')
  })

  emitter.on('nav_toggle', () => {
    state.nav_toggle =! state.nav_toggle
    emitter.emit('render')
  })

  emitter.on('status_toggle', () => {
    state.status_toggle =! state.status_toggle
    emitter.emit('render')
  })

  emitter.on('editor_toggle', () => {
    state.editor_toggle =! state.editor_toggle
    emitter.emit('render')
  })

  emitter.on('editor_retry', () => {
    state.components.txe.value('')
    emitter.emit('render')
  })

  emitter.on('disc-tab', () => {
    state.disc_tab = true
    state.read_tab = false
    state.todo_tab = false
    emitter.emit('render')
  })

  emitter.on('read-tab', () => {
    state.read_tab = true
    state.disc_tab = false
    state.todo_tab = false
    emitter.emit('render')
  })

  emitter.on('todo-tab', () => {
    state.todo_tab = true
    state.disc_tab = false
    state.read_tab = false
    emitter.emit('render')
  })

  emitter.on('close', () => {
    state.sidebar = false
    state.login = false
    emitter.emit('render')
  })

  emitter.on('login', () => {
    state.login =! state.login
    state.sidebar =! state.sidebar
    emitter.emit('render')
  })

  emitter.on('log-in', () => {
    localStorage.setItem('user_login', 'true');
    state.status_toggle = true

    // redirect to current module page
    const page = ov(state.content).filter(page => page.content.status === 'current')[0]
    emitter.emit('pushState', page.url)

    emitter.emit('render')
  })

  emitter.on('log-out', () => {
    const user_s = JSON.parse(localStorage.getItem('user_data'))
    const user = ok(users).filter(user => user === user_s.user.username)
    const user_id = user_s.user.id

    const auth = {'login': user, 'password': users[user]}

    localStorage.setItem('user_login', 'false');
    localStorage.removeItem('user_data');
    state.status_toggle = false

    state.login = true
    state.components.login = undefined

    emitter.emit('render')

    // xhr({
    //   method: 'post',
    //   body: auth,
    //   headers: {'Content-Type': 'multipart/form-data'},
    //   url: `https://forum.englishes-mooc.org/admin/users/${user_id}/log_out?api_key=${users[user]}&api_username=${user}`,
    //   json: true,
    //   beforeSend: function(xhrObject){
    //     xhrObject.onprogress = function(){
    //       // send.value = '...'
    //     }
    //   }
    // }, function (err, resp, body) {
    //   if (err) throw err
    //   console.log(body)

    //   localStorage.setItem('user_login', 'false');
    //   localStorage.removeItem('user_data');
    //   state.status_toggle = false

    //   state.login = true
    //   state.components.login = undefined

    //   emitter.emit('render')
    // })

  })

  emitter.on('delete_post', (id) => {
    const user_s = JSON.parse(localStorage.getItem('user_data'))
    const user = ok(users).filter(user => user === user_s.user.username)

    const opts = {
      id: id,
      user_k: users[user],
      user_v: user
    }

    xhr_call.delete_post(opts, (err, resp, body) => {
      if (err) throw err
      console.log(body)
    })
    emitter.emit('render')
  })

  emitter.on('section', (section) => {
    state.components.sidepage = section
    state.sidebar =! state.sidebar
    emitter.emit('render')
  })

  emitter.on('msg-posted', () => {
    document.querySelector('.send').value = 'post'
    document.querySelector('textarea').value = ''

    let page
    let cat_id

    if (state.route !== '/') {
      page = ov(state.content).filter(page => page.uri === state.route)[0]
      cat_id = page.content.cat_id
    } else {
      page = ov(state.content).filter(page => page.content.status === 'current')[0]
      cat_id = page.content.cat_id
    }

    return fetch_topic(state, emitter, page, cat_id)

    emitter.emit('render')
  })

}

module.exports = clickhandle
