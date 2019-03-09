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
        <form method="post" enctype="multipart/form-data">
          <input id="upload" type="file" onchange=${ upload } class="tdu curp">
        </form>

        <div>
          <textarea for="textinput" id="msg" name="msg" class="dib ba-bk"></textarea>
        </div>

        <form id="textinput" onsubmit=${ onsubmit } method="post" class="pb2">
          <div class="x xafs">
            <input type="submit" value="post" class="send fs1 tdu curp">

            <button class="dn fs1-3 retry-box curp" onclick=${ reset }>Retry</button>
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
    `

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
      const form = document.querySelector('#textinput')
      form.reset()

      const box = form.querySelector('.error-box')
      box.classList.remove('dib')
      box.classList.add('dn')

      const retry = form.querySelector('.retry-box')
      retry.classList.remove('dib')
      retry.classList.add('dn')

      const send = form.querySelector('.send')
      send.classList.remove('dn')
      send.value = 'post'
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
      defaultMode: 'markdown'
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

    console.log(wf)
    console.log(wf.find(textarea))
  }

  update () {
    return true
  }

}

module.exports = texteditor
