const { prefix } = require('../../config.json')
module.exports = client => {


  console.log(`Connected to: [ ${client.user.tag} ]`)
  client.user.setPresence({
    status: "idle",
    activity: {
      name: `${prefix}help | ${client.users.cache.size} users`,
      type: 'WATCHING'
    }
  })
}