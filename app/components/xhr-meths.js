const xhr = require('xhr')

// url, item, api_key, api_user

function xhrGetPost (catId, users, user, callback) {
  xhr({
    method: 'get',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `https://forum.englishes-mooc.org/c/${catId}.json?api_key=${users[user]}&api_username=${user[0]}`,
    json: true
  }, callback)
}

module.exports = {
  getPosts: xhrGetPosts
}
