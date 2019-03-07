var ok = require('object-keys')
var ov = require('object-values')
var xhr = require('xhr')
var users = require('./users.json')

function clickhandle (state, emitter) {
  state.sidebar = false
  state.login = false
  state.disc_tab = true
  state.read_tab = false
  state.todo_tab = false
  state.modules = []
  state.nav_toggle = true

  const modules = data.children.course.children
  ov(modules).map(function (module) {
    state.modules.push(true)
  })

  emitter.on('mod_toggle', function (module) {
    state.modules[module] =! state.modules[module]
    emitter.emit('render')
  })

  emitter.on('nav_toggle', () => {
    state.nav_toggle =! state.nav_toggle
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
    emitter.emit('render')
  })

  emitter.on('log-out', () => {
    xhr({
      method: "post",
      headers: {"Content-Type": "multipart/form-data"},
      url: `https://forum.englishes-mooc.org/admin/users/${state.components.user_id}/log_out?api_key=${users.system}&api_username=${ok(users)[0]}`,
      json: true,
      beforeSend: function(xhrObject){
        xhrObject.onprogress = function(){
          // send.value = '...'
        }
      }
    }, function (err, resp, body) {
      if (err) throw err
      console.log(body)

      state.login = true
      state.components.login = undefined

      emitter.emit('render')
    })

  })

  emitter.on('section', function (section) {
    state.components.sidepage = section
    state.sidebar =! state.sidebar
    emitter.emit('render')
  })

}

module.exports = clickhandle
