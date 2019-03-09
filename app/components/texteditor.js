var ok = require('object-keys')
var ov = require('object-values')
var nc = require('nanocomponent')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Markdown = require('markdown-it')
var md = new Markdown()
var wf = require('woofmark')
var mm = require('megamark')
var dm = require('domador')
var xhr = require('xhr')
var users = require('../stores/users.json')

class texteditor extends nc {
  constructor (state, emit) {
    super()

    this.state = null
    this.emit = null
  }

  createElement(state, emit) {
    this.state = state
    this.emit = emit

    return html`
      <div class="c12 pt1 pr1 pb1 pl1 copy">
        <button onclick=${editor_toggle(emit)} class="fs1 curp">${ state.editor_toggle ? '↑' : '↓' }</button>

        <div class="${ state.editor_toggle ? 'dn' : 'db'}">
          <form method="post" enctype="multipart/form-data">
            <input id="upload" type="file" onchange=${ upload } class="tdu curp">
          </form>

          <div>
            <textarea for="textinput" id="msg" name="msg" rows="5" class="c12 dib ba-bk b-bk"></textarea>
          </div>

          <div class="x xjb pt0-5">
            <button class="cancel-box fs1 tdu curp" onclick=${ reset }>cancel</button>

            <form id="textinput" onsubmit=${ onsubmit } method="post">
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

      </div>
    `

    function editor_toggle(emit) {
      return function () { emit('editor_toggle') }
    }

    function upload (e) {
      e.preventDefault()
      const form = e.currentTarget
      const file = form.files[0]
      let formData = new FormData()

      formData.append('module', state.page.content.title)
      formData.append('file', file)

      // for (var key of formData.entries()) {
      //   console.log(key[0] + ', ' + key[1]);
      // }

      console.log(file)

      xhr({
        method: 'post',
        headers: {'Content-Type': undefined},
        url: '/apiupload',
        body: formData,
        // beforeSend: function(xhrObject){
        //   xhrObject.onprogress = function(){
        //     send.value = '...'
        //   }
        // }
      }, function (err, resp, body) {
        if (err) throw err
        console.log(err, resp)
        console.log(body)
      })
    }

    function reset () {
      const txa = document.querySelector('textarea')
      console.log(txa)
      // txa.value = ''
    }

    function onsubmit (e) {
      e.preventDefault()
      const form = e.currentTarget
      const txa = form.firstChild
      const data = new FormData(form)
      const bot = document.querySelector('.bot')
      const send = form.querySelector('.send')

      const body = {}
      for (var pair of data.entries()) body[pair[0]] = pair[1]

      const msg = body.msg

      const post = {
        'title': '',
        'topic_id': state.components.discussion.id, 
        'raw': msg
      }

      const user_s = JSON.parse(localStorage.getItem('user_data'))
      const user = ok(users).filter(user => user === user_s.user.username)

      if (body.website !== '') {
        bot.classList.remove('dn')
      } else if (body.msg === '') {
        form.childNodes[0].childNodes[0].value='Type something before sending a message'
      } else {
        xhr({
          method: 'post',
          headers: {'Content-Type': 'multipart/form-data'},
          url: `https://forum.englishes-mooc.org/posts.json?api_key=${users[user]}&api_username=${user}&title='what?'&topic_id=${state.components.discussion.id}&raw=${msg}`,
          json: true,
          beforeSend: function(xhrObject){
            xhrObject.onprogress = function(){
              send.value = '...'
            }
          }
        }, function (err, resp, body) {
          if (err) throw err

          console.log(body)

          if (body.error) {
            const box = form.querySelector('.error-box')
            box.classList.remove('dn')
            box.classList.add('dib')

            const retry = form.querySelector('.retry-box')
            retry.classList.remove('dn')
            retry.classList.add('dib')

            const msg = 'Something went wrong, try again.'
            box.firstChild.innerHTML = msg

            send.classList.add('dn')

          } else {
            console.log('request ok!', body)
            form.reset()
            send.value = "posted"
          }

        })
      }
    }

  }

  load(el) {
    const textarea = el.querySelector('textarea')
    wf(textarea, {
      parseMarkdown: mm,
      parseHTML: dm,
      defaultMode: 'markdown',
      html: false
    })

    // woofmark(document.querySelector('#ta'), {
    //   parseMarkdown: megamark,
    //   parseHTML: parseHTML,
    //   fencing: true,
    //   defaultMode: 'wysiwyg',
    //   images: {
    //     url: '/uploads/images',
    //     validate: imageValidator
    //   },
    //   attachments: {
    //     url: '/uploads/attachments'
    //   }
    // });
  }

  update () {
    return true
  }

}

module.exports = texteditor
