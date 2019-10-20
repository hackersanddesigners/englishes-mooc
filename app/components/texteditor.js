const ok = require('object-keys')
const ov = require('object-values')
const nc = require('nanocomponent')
const html = require('choo/html')
const wf = require('woofmark')
const mm = require('megamark')
const dm = require('domador')
const xhr_call = require('./xhr-call')
const api = require('../stores/api.json')
const xhr = require('xhr')

class texteditor extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement (state, emit) {
    this.state = state
    this.emit = emit

    return html`
      <div>
        <div class="file-error-box c12 x xjb pb0-5 dn">
          <p class="dib pb0 pr1"></p>
          <button class="tdu curp" onclick=${filemsg_toggle}>close</button>
        </div>
        <div class="z3 psa to r0 pt0-25 pr0-5">
          <form method="post" enctype="multipart/form-data" class="psr oh dib">
            <button class="butt-upload tdu curp">upload file</button>
            <input id="upload" type="file" onchange=${upload} class="psa t0 l0 op0 curp">
          </form>
        </div>

        <div class="txa">
          <textarea for="textinput" id="msg" name="msg" rows="5" class="c12 dib ba-bk b-bk p0-25 fs1 ft-rg"></textarea>
        </div>

        <div class="x xjb pt0-5">
          <button class="retry dn fs1 tdu curp" onclick=${editor_retry}>retry</button>
          <button class="cancel fs1 tdu curp" onclick=${editor_cancel}>cancel</button>

          <form id="textinput" onsubmit=${onsubmit} method="post">
            <div class="x xafs">
              <input type="submit" value="post" class="send fs1 tdu curp">

              <div class="dn success-box pl1">
                <p class="dib pb0"></p>
              </div>

              <div class="dn error-box pl1">
                <p class="dib pb0"></p>
              </div>
            </div>

            <div class="psf t0 l999">
              <label for="message">If you are not a bot, leave this field empty</label>
              <input type="website" name="website" id="website" placeholder ="http://example.com" value="">
            </div>
            <div class="bot dn psa t0 l0 w100 h100 tac">
              <p class="psa t50 l50 ttcc">Hello bot!</p>
            </div>
          </form>
        </div>

      </div>
    `

    function editor_toggle (emit) {
      return function () { emit('editor_toggle') }
    }

    function filemsg_toggle (e) {
      e.preventDefault()
      document.querySelector('.file-error-box').classList.remove('dib')
      document.querySelector('.file-error-box').classList.add('dn')
    }

    function editor_cancel (e) {
      e.preventDefault()
      document.querySelector('textarea').value = ''
    }

    function editor_retry (e) {
      e.preventDefault()

      document.querySelector('textarea').value = ''
      const send = document.querySelector('.send')
      send.classList.remove('dn')
      send.value = 'post'

      const error = document.querySelector('.error-box')
      error.classList.add('dn')

      document.querySelector('.retry').classList.add('dn')
      document.querySelector('.cancel').classList.remove('dn')
    }

    function upload (e) {
      e.preventDefault()
      const form = e.currentTarget
      const file = form.files[0]
      const send = form.parentNode.parentNode.parentNode.querySelector('.send')

      let formData = new FormData()
      formData.append('file', file)
      formData.append('template', 'assignment')

      const email = ok(api)
      const password = ov(api)[0]
      const auth = Buffer.from([email, password].join(':')).toString('base64')

      const box = document.querySelector('.file-error-box')

      let page
      if (state.route !== '/') {
        page = ov(state.content).filter(page => page.uri === state.route)[0]
      } else {
        page = ov(state.content).filter(page => page.content.status === 'current')[0]
      }

      box.classList.remove('dn')
      box.firstChild.innerHTML = 'Uploading...'

      const user_s = JSON.parse(localStorage.getItem('user_data')).user
      const user = {
        username: user_s.username
      }

      let file_opts = {
        auth: auth,
        page_id: page.id.replace('/', '+'),
        form_data: formData,
        user: JSON.stringify(user)
      }

      xhr_call.fileUpload(file_opts, (err, resp, body) => {
        if (err) throw err
        const bd = JSON.parse(body)

        if (bd.status === 'error') {
          box.firstChild.innerHTML = bd.message '.'
        } else {
          file_opts['filename'] = bd.data.filename
          xhr_call.fileTxtUpload(file_opts, (err, resp, body) => {
            if (err) throw err

            if (resp.statusCode !== 200) {
              console.log('error: file-txt upload')
            } else {
              let msg = `[${bd.data.filename}](${bd.data.url})`
              // msg = encodeURI(msg)

              const post_opts = {
                title: '',
                disc_tab: state.disc_tab,
                disc_id: state.components.discussion.id,
                raw: msg,
                username: user.username,
                send: send
              }

              xhr_call.postUpload(post_opts, (err, resp, body) => {
                if (err) throw err

                console.log(body)

                if (body.errors) {
                  box.classList.remove('dn')
                  box.classList.add('dib')

                  box.firstChild.innerHTML = body.errors[0]
                } else {
                  emit('msg-posted')
                  emit('loadmore')
                  emit('post-pag')
                }
              })

              console.log('file text uploaded')
            }
          })
          box.firstChild.innerHTML = 'File uploaded!'
        }
      })
    }

    function onsubmit (e) {
      e.preventDefault()
      const form = e.currentTarget
      const data = new FormData(form)
      const bot = document.querySelector('.bot')
      const send = form.querySelector('.send')
      const cancel = document.querySelector('.cancel')
      const retry = document.querySelector('.retry')

      const body = {}
      for (let pair of data.entries()) body[pair[0]] = pair[1]

      const txe = state.components.txe
      let msg
      // if (txe.parseMarkdown(txe.value()) !== '') {
      //   msg = txe.parseMarkdown(txe.value())
      // } else {
      //   msg = document.querySelector('textarea').value
      // }

      // did discourse change APIs for this?
      // or is it bc im POSTing the msg through PHP now?
      // anyway i can send directly md and need to encode (makes sense)
      msg = encodeURI(document.querySelector('textarea').value)

      const user_s = JSON.parse(localStorage.getItem('user_data')).user
      const user = {
        id: user_s.id,
        username: user_s.username,
        name: user_s.name
      }

      const post_opts = {
        title: '',
        disc_tab: state.disc_tab,
        disc_id: state.components.discussion.id,
        // ass_id: state.components.assignment.id,
        raw: msg,
        username: user.username,
        send: send
      }

      console.log('POST_OPTS', post_opts)

      if (body.website !== '') {
        bot.classList.remove('dn')
      } else if (msg === '') {
        form.childNodes[0].childNodes[0].value = 'Type something before sending a message'
        form.childNodes[0].childNodes[0].classList.remove('tdu curp')
      } else {
        xhr_call.postUpload(post_opts, (err, resp, body) => {
          if (err) throw err

          if (body.errors) {
            const box = form.querySelector('.error-box')
            box.classList.remove('dn')
            box.classList.add('dib')

            // const text = 'Something went wrong, try again.'
            box.firstChild.innerHTML = body.errors[0]

            cancel.classList.add('dn')
            retry.classList.remove('dn')

            send.classList.add('dn')
          } else {
            send.value = 'posted'

            emit('msg-posted')
            emit('loadmore')
            emit('post-pag')
          }
        })
      }
    }
  }

  update (el) {
    return false
  }

  beforerender (el) {
    const textarea = el.querySelector('textarea')
    const txe = wf(textarea, {
      parseMarkdown: mm,
      parseHTML: dm,
      defaultMode: 'markdown',
      wysiwyg: false,
      html: false
    })
  }

  load (el) {
    const textarea = el.querySelector('textarea')
    this.state.components.txe = wf.find(textarea)
  }

  unload (el) {
    const txe = this.state.components.txe
  }
}

module.exports = texteditor
