require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const args = process.argv
const pw_gen = require('generate-password')

// USAGE:
// node forum-user-generator.js <interest hash code>
// lookup the interest code by using mailchimp playground APIs

// example of Mailchimp API GET call
// curl --request GET --url 'https://<string after dash of api key>.api.mailchimp.com/3.0/lists/<list id>/members/<lowercase md5 of email address>' --user '<anystring>:<api key>'

const authorization = Buffer.from([
  process.env.API_USR, process.env.API_KEY
].join(':')).toString('base64')

function forum_user_generator () {
  // get list of users from group

  async function getMembers () {
    let response = await fetch(`https://${process.env.API_ID}.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}/members?offset=0&count=200`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authorization}`
      }
    })
    return response.json()
  }

  let users = []
  function processMembers (data, users) {
    const members = data.filter(member => member.interests[args[2]] === true)

    members.map(member => {
      const usr = member.merge_fields.MMERGE1.replace(' ', '.').toLowerCase()
      const pw = pw_gen.generate({ length: 19, numbers: false }).match(/.{1,7}/g).join('-')

      const user = {
        name: member.merge_fields.MMERGE1,
        username: usr,
        email: member.email_address,
        password: pw,
        active: true,
        approved: true
      }

      users.push(user)
    })
    return users
  }

  async function createForumUser (data) {
    let response = await fetch(`https://forum.englishes-mooc.org/users?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async function deactivateForumUser (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/deactivate.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'PUT'
    })
    return response
  }

  async function reactivateForumUser (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/activate.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'PUT'
    })
    return response
  }

  async function generateUserAPIk (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/generate_api_key.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  // convert writeFile to async / await func?
  // https://stackoverflow.com/a/52094177
  function writeFile (path, data) {
    fs.writeFile(path, data, (err) => {
      if (err) throw err
      console.log('File has been written successfully!')
    })
  }

  let fy_users = [
    {
      name: 'Yasa',
      username: 'yasa',
      email: 'yasa@gva.de',
      password: 'xx-yyyy-a-tt--c',
      active: true,
      approved: true
    }, {
      name: 'Yeka',
      username: 'yeka',
      email: 'yeka@gva.de',
      password: 'oo-yyyy-a-tt--c',
      active: true,
      approved: true
    }]

  getMembers()
    .then(response => {
      let data = processMembers(response.members, users)
      return data
    }).then(data => {
      // call `create-user` for batches of 10 items, then wait 50 sec

      data.map(user => {
        // create-user
        createForumUser(user).then(response => {
          console.log(response)

          let id = response.user_id

          // deactivate-user
          deactivateForumUser(id)
            .then(response => {
              console.log('deactive-forum-user: status', response.statusText)
              if (response.status === 200) {
                // reactivate-user
                reactivateForumUser(id)
                  .then(response => {
                    console.log('reactive-forum-user: status', response.statusText)
                    return response
                  }).then(response => {
                    if (response.status === 200) {
                      // generate-user-api-k
                      generateUserAPIk(id)
                        .then(response => {
                          console.log('user-API-key: done')
                          user['api_key'] = response.api_key.key
                          console.log(data)
                          return data 
                        }).then((data) => {
                          // write-file-to-disk
                          const new_users= JSON.stringify(data)
                          writeFile('./new-forum-users.json', new_users)
                        })
                    }
                  })
              }
            })
        }).catch(e => {
          throw e
        })
      })
    })
}

forum_user_generator()
