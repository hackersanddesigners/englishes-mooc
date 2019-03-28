const xhr = require('xhr')

// url, item, api_key, api_user

function xhr_get_posts(callback) {

  xhr({
    method: 'get',
    headers: {'Content-Type': 'multipart/form-data'},
    url: `https://forum.englishes-mooc.org/c/${ cat_id }.json?api_key=${users[user]}&api_username=${user[0]}`,
    json: true,
  }, callback)

}

module.exports = {
  posts: xhr_get_posts
}
