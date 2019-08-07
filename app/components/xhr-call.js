const xhr = require('xhr')

// url, item, api_key, api_user

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

module.exports = {
  getPosts: getPosts,
  getTopic: getTopic
}
