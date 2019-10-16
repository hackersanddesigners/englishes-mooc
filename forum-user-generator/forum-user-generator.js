require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const args = process.argv
const slugify = require('@sindresorhus/slugify')
const pw_gen = require('generate-password')
const yaml = require('write-yaml')

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

  async function getMembers (offset_s, offset_e) {
    let response = await fetch(`https://${process.env.API_ID}.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}/members?offset=${offset_s || 0}&count=${offset_e || 1000}`, {
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
      if (response.status === 200) {
        console.log('success deactivate-user')
        return response.statusText
      } else {
        console.log('error deactivate-user')
        return response
      }
    } catch (err) {
      console.log('error deactivate-user')
      throw err
    }
  }

  async function reactivateForumUser (id) {
    let response = await fetch(`https://forum.englishes-mooc.org/admin/users/${id}/activate.json?api_key=${process.env.API_KEY_S}&api_username=${process.env.API_USR_S}`, {
      method: 'PUT'
    })

    try {
      if (response.status === 200) {
        console.log('success reactivate-user')
        return response.statusText
      } else {
        console.log('error reactivate-user')
        return response
      }
    } catch (err) {
      console.log('error reactivate-user')
      throw err
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
      if (response.status === 200) {
        let json = await response.json()
        console.log('success generate-user-k')
        return json
      } else {
        console.log('error create-user')
        let json = await response.json()
        return json
      }
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

  function user_batch (data, size) {
    let counter = 0
    let user_slice = []
    data.map(async (item, i) => {
      if (counter === size) {
        counter = 0
        // write-file-to-disk
        let us = JSON.stringify(user_slice)
        const fn = `./new-users/user-slice--${i}.json`
        writeFile(fn, us)
        console.log('--- slice has been written to disk ---')
      } else {
        counter++
        user_slice.push(item)
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

  async function readFile (filepath) {
    let data = await fs.readFile(filepath, 'utf-8')
    return data
  }

  ;

  (async() => {
    // fire this off
    if (args[3] === 'create') {
      // get member-list
      let members = await getMembers(args[4], args[5])
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
        user['id'] = id 

        // write-file-to-disk
        const cu = JSON.stringify(users)
        const fn = `./new-users/create-new-forum-users-${args[4]}-${args[5]}--${new Date().toISOString()}.json`
        writeFile(fn, cu)

        // let deactivate_user = await deactivateForumUser(id)
        // let reactivate_user = await reactivateForumUser(id)
        // let user_k = await generateUserAPIk(id)
        // console.log(user_k)
        // user['api_key'] = user_k.api_key.key
      }) 

    } else if (args[3] === 'list') {
      // get member-list
      let members = await getMembers(args[5], args[6])
      let filtered_members = []
      let users = processMembers(members.members, filtered_members)
      console.log(users)
      console.log(`list-size: ${users.length}`)

      // write-file-to-disk
      const data = JSON.stringify(users)
      const fn = `./new-users/list-new-forum-users--${new Date().toISOString()}.json`
      writeFile(fn, data)

    } else if (args[2] === 'new-create') {
      // get member-list
      console.log('running `new-create`')
      let users = JSON.parse(fs.readFileSync(args[3]))
      console.log(users)

      // map over each user and do create-user-workflow
      users.map(async (user, i) => {
        let create_user = await createForumUser(user)
        console.log(create_user)

        let id = create_user.user_id
        user['id'] = id 

        // write-file-to-disk
        const cu = JSON.stringify(users)
        const fn = `./new-users/create-new-forum-users--${new Date().toISOString()}.json`
        writeFile(fn, cu)
      })
    } else if (args[2] === 'new-deactivate') {
      // get member-list
      console.log('running `new-deactivate`')
      let users = JSON.parse(fs.readFileSync(args[3]))

      // map over each user and do create-user-workflow
      users.map(async (user, i) => {
        let id = user.id

        console.log(user)
        console.log('---')

        let deactivate_user = await deactivateForumUser(id)
        console.log(user.username, deactivate_user)
      })
    } else if (args[2] === 'new-reactivate') {
      // get member-list
      console.log('running `new-reactivate`')
      let users = JSON.parse(fs.readFileSync(args[3]))

      // map over each user and do create-user-workflow
      users.map(async (user, i) => {
        let id = user.id

        console.log(user)
        console.log('---')

        let reactivate_user = await reactivateForumUser(id)
        console.log(user.username, reactivate_user)
      })
    } else if (args[2] === 'new-user-k') {
      // get member-list
      console.log('running `new-user-k`')
      let users = JSON.parse(fs.readFileSync(args[3]))

      // map over each user and do create-user-workflow
      users.map(async (user, i) => {
        let id = user.id

        console.log(user)
        console.log('---')

        let user_k = await generateUserAPIk(id)
        console.log(user_k)
        user['api_key'] = user_k.api_key.key

        // write-file-to-disk
        const cu = JSON.stringify(users)
        const fn = `./new-users/new--${args[3]}.json`
        writeFile(fn, cu)
      })
    } else if (args[2] === 'to-yaml') {
      let data = JSON.parse(fs.readFileSync(args[3]))
      console.log(data)

      yaml(`./${args[3].replace('json', 'yaml')}`, data, err => {
        if (err) throw err
        console.log('file has been written to disk!')
      })
    }
  })()
}

// fire this off
forum_user_generator()
