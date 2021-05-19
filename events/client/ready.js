const { prefix } = require('../../config.json')
odule.exports = client => {


  console.log(`Connected to: [ ${client.user.tag} ]`)
  client.user.setPresence({
    status: "idle",
    activity: {
      name: `${prefix}help | ${client.users.cache.size} users`,
      type: 'WATCHING'
    }
  })
}