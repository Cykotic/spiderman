const { prefix } = require("../../config.json");
const { Collection, MessageEmbed } = require('discord.js');
// const Timeout = new Collection();
// const ms = require('ms')
const mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'spiderman'
});
module.exports = async (client, message) => {

  /* mainly just for the memes */
  if (message.content == "F") {
    message.reply("has paid respects!");
  }

  /* the prefix system along ith aliases, or what i like to call the prefix system */
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  if(!message.guild) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));

   /* permission handler */
  if(command.memberpermissions && !message.member.hasPermission(command.memberpermissions)) {
    return message.channel.send(new MessageEmbed()
    .setColor(0xff1100)
    .setTimestamp()
    .setFooter(message.author.tag, message.member.user.displayAvatarURL())
    .setTitle("❌ Error | You are not allowed to run this command!")
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`Missing Permissions: \`${command.memberpermissions}\``)
    ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))
  }

  
  /* cooldown system */
  // if (command) {
  //   if (!client.cooldowns.has(command.name)) { client.cooldowns.set(command.name, new Collection()) }
  //   const now = Date.now(); const timestamps = client.cooldowns.get(command.name); const cooldownAmount = (command.cooldown || 1.5) * 1000; if (timestamps.has(message.author.id)) { const expirationTime = timestamps.get(message.author.id) + cooldownAmount; if (now < expirationTime) { const timeLeft = (expirationTime - now) / 1000; return message.channel.send(new MessageEmbed().setColor(0xff1100).setTimestamp().setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`).setTitle(`❌ Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)).then(msg => msg.delete({ timeout: 20000 })); } } timestamps.set(message.author.id, now); setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  // } else { 
  //   message.delete()
  // }
  if (command) command.run(client, message, args, pool)
}