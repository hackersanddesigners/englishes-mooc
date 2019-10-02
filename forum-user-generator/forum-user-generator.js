require('dotenv').config()
const fetch = require('node-fetch')
const args = process.argv

// example of Mailchimp API GET call
// curl --request GET --url 'https://<string after dash of api key>.api.mailchimp.com/3.0/lists/<list id>/members/<lowercase md5 of email address>' --user '<anystring>:<api key>'

const authorization = Buffer.from([
  process.env.API_USR, process.env.API_KEY
].join(':')).toString('base64')

function forum_user_generator () {
  // get list of users from group
  fetch(`https://${process.env.API_ID}.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}/members?offset=0&count=200`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authorization}`
    }
  })
    .then(response => response.json())
    .then(response => {
      const members = response.members.filter(member => member.interests[args[2]] === true)
      members.map(member => {
        console.log(member.email_address)
      })
    })
}

forum_user_generator()
