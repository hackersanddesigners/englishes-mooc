const xhr = require('xhr')

function getPosts (opts, cb) {
  xhr({
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `https://forum.englishes-mooc.org/c/${opts.cat_id}.json?api_key=${opts.user_k}&api_username=${opts.user_v}`,
    json: true
  }, cb)
}

function getTopic (opts, cb) {
  xhr({
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `https://forum.englishes-mooc.org/t/${opts.topic_id}.json?api_key=${opts.user_k}&api_username=${opts.user_v}`,
    json: true
  }, cb)
}

function login (opts, cb) {
  xhr({
    method: 'post',
    body: opts.auth,
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `https://forum.englishes-mooc.org/session?api_key=${opts.user_k}&api_username=${opts.user_v}&login=${opts.name}&password=${opts.pw}`,
    json: true,
    beforeSend: (xhrObject) => {
      xhrObject.onprogress = () => {
        opts.send.value = '...'
      }
    }
  }, cb)
}

function signup (opts, cb) {
  xhr({
    method: 'post',
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
    method: 'post',
    headers: {
      Authorization: `Basic ${opts.auth}`
    },
    uri: `/api/pages/${opts.page_id}/files`,
    body: opts.formData
  }, cb)
}

function post_upload (opts, cb) {
  xhr({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `https://forum.englishes-mooc.org/posts.json?api_key=${users[user]}&api_username=${user}&title='what?'&topic_id=${ state.disc_tab ? state.components.discussion.id : state.components.assignment.id }&raw=${msg}`,
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
    method: 'delete',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `https://forum.englishes-mooc.org/posts/${opts.id}?api_key=${opts.user_k}&api_username=${opts.user_v}`,
    json: true
  }, cb)
}

module.exports = {
  getPosts: getPosts,
  getTopic: getTopic,
  login: login,
  signup: signup,
  fileUpload: file_upload,
  postUpload: post_upload,
  postDelete: post_delete
}
