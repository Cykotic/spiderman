const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'ping',
    category: "⚙️ | utility",
    description : 'Returns latency and API ping',

    run : async(client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`)
        const embed = new MessageEmbed()
            .setTitle('Pong!')
            .setColor(0xff1100)
            .setDescription(`WebSocket ping is ${client.ws.ping}MS\nMessage edit ping is ${Math.floor(msg.createdAt - message.createdAt)}MS!`)
            await message.channel.send(embed)
            msg.delete()

    }
}