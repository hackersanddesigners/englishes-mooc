const ok = require('object-keys')
const ov = require('object-values')
const xhr_call = require('../components/xhr-call.js')
const fetch_topic = require('../components/fetch-topic')
const users = require('../stores/users')

function clickhandle (state, emitter) {
  state.sidebar = false
  state.login = false
  state.disc_tab = true
  state.group_tab = false
  state.read_tab = false
  state.modules = []
  state.nav_toggle = true
  state.status_toggle = true
  state.editor_toggle = true
  state.videos = []
  state.videos_fullscreen = []

  const modules = data.children.course.children
  ov(modules).map((module) => {
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
    state.group_tab = false
    state.read_tab = false
    emitter.emit('render')
  })

  emitter.on('group-tab', () => {
    state.group_tab = true
    state.disc_tab = false
    state.read_tab = false
    emitter.emit('render')
  })

  emitter.on('read-tab', () => {
    state.read_tab = true
    state.group_tab = false
    state.disc_tab = false
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
    localStorage.setItem('user_login', 'true')
    state.status_toggle = true

    // redirect to current module page
    // const page = ov(state.content).filter(page => page.content.status === 'current')[0]
    // if (page !== undefined) {
    //   emitter.emit('pushState', page.url)
    // } else {
    //   console.log('click log-in doin wat?')
    // }

    emitter.emit('render')
  })

  emitter.on('log-out', () => {
    const user = JSON.parse(localStorage.getItem('user_data'))

    localStorage.setItem('user_login', 'false')
    localStorage.removeItem('user_data')
    state.status_toggle = false

    state.login = true
    state.components.login = undefined

    const opts = {
      user_id: user.id
    }

    emitter.emit('render')

    xhr_call.logout(opts, (err, resp, body) => {
      if (err) throw err
      localStorage.setItem('user_login', 'false')
      localStorage.removeItem('user_data')
      state.status_toggle = false

      state.login = true
      state.components.login = undefined

      emitter.emit('pushState', '/')
    })
  })

  emitter.on('delete_post', (id) => {
    const user = JSON.parse(localStorage.getItem('user_data'))
    const opts = {
      id: id,
      username: user.username
    }

    xhr_call.postDelete(opts, (err, resp, body) => {
      if (err) throw err
      emitter.emit('render')
    })
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

    fetch_topic(state, emitter, page, cat_id)
    emitter.emit('render')
  })

  emitter.on('video-toggle', (i, vplayer) => {
    if (state.videos[i].play !== true) {
      vplayer.ready().then(() => {
        state.videos[i].ready = true
        emitter.emit('render')
      }).catch((error) => {
        console.log(error)
      })

      vplayer.play().then(() => {
        state.videos[i].play = true
        state.videos[i].ready = false
        emitter.emit('render')
      }).catch((error) => {
        console.log(error)
      })
    } else {
      vplayer.pause().then(() => {
        state.videos[i].play = false
        emitter.emit('render')
      }).catch((error) => {
        console.log(error)
      })
    }
  })

  emitter.on('fullscreen-toggle', (i, videoWrapper) => {
    if (state.videos_fullscreen[i] !== true) {
      state.videos_fullscreen[i] = true
      toggleFullscreen(videoWrapper)
      emitter.emit('render')
    } else {
      state.videos_fullscreen[i] = false
      toggleFullscreen(videoWrapper)
      emitter.emit('render')
    }
  })

  function toggleFullscreen (videoWrapper) {
    let fullscreenChange = null

    // Check for fullscreen support
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      // If there's currently an element fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    } else {
      // Otherwise, enter fullscreen
      if (videoWrapper.requestFullscreen) {
        videoWrapper.requestFullscreen()
      } else if (videoWrapper.mozRequestFullScreen) {
        videoWrapper.mozRequestFullScreen()
      } else if (videoWrapper.webkitRequestFullscreen) {
        videoWrapper.webkitRequestFullscreen()
      } else if (videoWrapper.msRequestFullscreen) {
        videoWrapper.msRequestFullscreen()
      }
    }

    fullscreenChange = () => {
      // Do something on fullscreen change event
      // …
    }

    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        fullscreenChange()
      }
    }
    document.onwebkitfullscreenchange = () => {
      if (!document.webkitFullscreenElement) {
        fullscreenChange()
      }
    }
    document.onmozfullscreenchange = () => {
      if (!document.mozFullScreenElement) {
        fullscreenChange()
      }
    }
    document.onmsfullscreenchange = () => {
      if (!document.msFullscreenElement) {
        fullscreenChange()
      }
    }
  }
}

module.exports = clickhandle
