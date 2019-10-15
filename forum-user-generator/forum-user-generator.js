require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const args = process.argv
const slugify = require('@sindresorhus/slugify')
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

    if (response.status === 200) {
      let json = await response.json()
      return json
    }
    throw new Error(response.status)
  }

  function processMembers (data, users) {
    const members = data.filter(member => member.interests[args[2]] === true)

    members.map(member => {
      const usr = slugify(member.merge_fields.MMERGE1, { separator: '.' })
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

    try {
      if (response.status === 200) {
        let json = await response.json()
        console.log('success create-user')
        return json
      } else {
        console.log('error create-user')
        let json = await response.json()
        return json
      }
    } catch (err) {
      console.log('error create-user')
      let json = await err.json()
      return json
    } 
  }

  async function deactivateForumUser (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/deactivate.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'PUT'
    })

    try {
      let json = await response.json()
      console.log('success deactivate-user')
      return json
    } catch (err) {
      console.log('error deactivate-user')
      let json = await err.json()
      return json
    }
  }

  async function reactivateForumUser (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/activate.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'PUT'
    })

    try {
      let json = await response.json()
      console.log('success reactivate-user')
      return json
    } catch (err) {
      console.log('error reactivate-user')
      let json = await err.json()
      return json
    }
  }

  async function generateUserAPIk (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/generate_api_key.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    try {
      let json = await response.json()
      console.log('success generate-user-k')
      return json
    } catch (err) {
      console.log('error generate-user-k')
      let json = await err.json()
      return json
    }

  }

  // convert writeFile to async / await func?
  // https://stackoverflow.com/a/52094177
  function writeFile (path, data) {
    fs.writeFile(path, data, (err) => {
      if (err) throw err
      console.log('File has been written successfully!')
    })
  }

  function user_batch (data, size, t) {
    let counter = 0

    data.map(async (item, i) => {
      let turn = 0
      if (counter === size) {
        counter = 0
        turn++
        console.log('---')
        console.log('counter', counter)
        console.log('--- breaking every 10 items ---')

        const t = 10000 * turn
        await sleep(t)
        console.log(`--- waited for ${t}ms ---`)
      } else {
        counter++
        console.log(counter, i, item)
      }
    })
  }

  const sleep = require('util').promisify(setTimeout)

  async function waitSomeTime (fn, t) {
    console.log(`wait for ${t}ms`)
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn, t))
    })
  }

  ;

  (async() => {
    // fire this off
    if (args[3] === 'create') {
      // get member-list
      let members = await getMembers()
      console.log('--- *members* anon-async bitch ---')

      // get only users from <> group
      let filtered_members = []
      let users = processMembers(members.members, filtered_members)
      console.log(users)
      console.log('--- *users* anon-async bitch ---')

      // map over each user and do create-user-workflow
      users.map(async (user, i) => {
        let create_user = await createForumUser(user)
        console.log(create_user)

        // if ('error_type' in create_user && create_user.error_type === 'rate_limit') {
        //   const time = create_user.extras.wait_seconds
        //   const t = time * 1000 * i
        //   let tt = await waitSomeTime(t)
        //   console.log(tt)
        //   create_user = await createForumUser(user)
        //   console.log(create_user)
        // } else {
        //   console.log(create_user)
        // }

        let id = create_user.user_id
        let deactivate_user = await deactivateForumUser(id)

        let reactivate_user = await reactivateForumUser(id)

        let user_k = await generateUserAPIk(id)
        user['api_key'] = user_k.api_key.key

        const new_users = JSON.stringify(users)
        const fn = `./new-forum-users.json${new Date().toISOString()}`
        writeFile(fn, new_users)
      })
    } else if (args[3] === 'list') {
      // get member-list
      let members = await getMembers()
      let filtered_members = []
      let users = processMembers(members.members, filtered_members)
      console.log(users)
      console.log(`list-size: ${users.length}`)
    }
  })()
}

// fire this off
forum_user_generator()
