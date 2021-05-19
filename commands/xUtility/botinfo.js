const { MessageEmbed } = require('discord.js');


module.exports = {
    name: "botinfo",
    description: "A command which gives the description of the bot",
    category: "⚙️ | utility",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setTitle("Why was this bot created?")
            .setDescription("**the soul purpose of this bot, was just to be a simple project, and for mainly learning purposes only. this is not the full pannel, but you can buy the pannel by contacting one of the sellers**")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(0xff1100)
            .setTimestamp()
            .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        message.channel.send(embed)
    }
}