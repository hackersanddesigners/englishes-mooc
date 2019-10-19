const xhr = require('xhr')
const url_root = 'https://forum.englishes-mooc.org'

function get_posts (opts, cb) {
  xhr({
    method: 'POST',
    body: opts,
    uri: '/apipost',
    json: true
  }, cb)
}

function get_topic (opts, cb) {
  xhr({
    method: 'POST',
    body: opts,
    uri: '/apitopic',
    json: true
  }, cb)
}

function login (opts, cb) {
  xhr({
    method: 'POST',
    body: opts,
    uri: '/api-login',
    json: true,
    beforeSend: (xhrObject) => {
      xhrObject.onprogress = () => {
        opts.send.value = '...'
      }
    }
  }, cb)
}

function logout (opts, cb) {
  xhr({
    method: 'POST',
    body: opts,
    uri: '/api-logout',
    json: true
    // beforeSend: (xhrObject) => {
    //   xhrObject.onprogress = () => {
    //     opts.send.value = '...'
    //   }
    // }
  }, cb)
}

function signup (opts, cb) {
  xhr({
    method: 'POST',
    body: opts.body,
    uri: '/apisignup',
    json: true,
    beforeSend: (xhrObject) => {
      xhrObject.onprogress = () => {
        opts.send.value = '...'
      }
    }
  }, cb)
}

function file_upload (opts, cb) {
  xhr({
    method: 'POST',
    headers: {
      Authorization: `Basic ${opts.auth}`
    },
    uri: `/api/pages/${opts.page_id}/files`,
    body: opts.form_data
  }, cb)
}

function file_txt_upload (opts, cb) {
  xhr({
    method: 'PATCH',
    headers: {
      Authorization: `Basic ${opts.auth}`
    },
    uri: `/api/pages/${opts.page_id}/files/${opts.filename}`,
    body: opts.user
  }, cb)
}

function post_upload (opts, cb) {
  xhr({
    method: 'POST',
    uri: '/api-post-msg',
    body: opts,
    json: true,
    beforeSend: (xhrObject) => {
      xhrObject.onprogress = () => {
        opts.send.value = '...'
      }
    }
  }, cb)
}

function post_delete (opts, cb) {
  xhr({
    method: 'POST',
    uri: '/apimsgdel',
    body: opts,
    json: true
  }, cb)
}

module.exports = {
  getPosts: get_posts,
  getTopic: get_topic,
  login: login,
  logout: logout,
  signup: signup,
  fileUpload: file_upload,
  fileTxtUpload: file_txt_upload,
  postUpload: post_upload,
  postDelete: post_delete
}
