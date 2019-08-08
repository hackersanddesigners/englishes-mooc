const xhr = require('xhr')

const url_root = 'https://forum.englishes-mooc.org'

function getPosts (opts, cb) {
  xhr({
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `${url_root}/c/${opts.cat_id}.json?api_key=${opts.user_k}&api_username=${opts.user_v}`,
    json: true
  }, cb)
}

function getTopic (opts, cb) {
  xhr({
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `${url_root}/t/${opts.topic_id}.json?api_key=${opts.user_k}&api_username=${opts.user_v}`,
    json: true
  }, cb)
}

function login (opts, cb) {
  xhr({
    method: 'post',
    body: opts.auth,
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `${url_root}/session?api_key=${opts.user_k}&api_username=${opts.user_v}&login=${opts.name}&password=${opts.pw}`,
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
    url: `${url_root}/posts.json?api_key=${opts.user_k}&api_username=${opts.user_v}&title='what?'&topic_id=${opts.disc_tab ? opts.disc_id : opts.ass_id}&raw=${opts.msg}`,
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
    url: `${url_root}/posts/${opts.id}?api_key=${opts.user_k}&api_username=${opts.user_v}`,
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
