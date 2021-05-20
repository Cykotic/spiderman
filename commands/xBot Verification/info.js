const { MessageEmbed } = require('discord.js');
function findPlan(plan) {
    switch(plan) {
        case 0: return "Unpaid";
        case 1: return "Diamond";
        case 2: return "Lifetime";
        default: return "Unknown";
    }
}
module.exports = {
    name: "info",
    description: "A command which connects Discord account to the bot",
    category: "⚙️ | utility",
    run: async (client, message, args, pool) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;
        
            var target = message.author;

            connection.query(`select * from users where discordid='${target.id}'`, async (err, rows) => {
                if (err) throw err;
        
                var verified = rows[0].discordverified;
        
                if (verified === 0)
                  return message.channel.send(new MessageEmbed()
                  .setTitle("❌ Error | you have not verified your Discord account with the bot!!")
                  .setColor(0xff1100)
                  .setTimestamp()
                  .setFooter(message.author.tag, message.member.user.displayAvatarURL())
                  ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

                var name = rows[0].name;
                var plan = rows[0].plan;
                var expires = new Date(rows[0].expires);
                var today = new Date();
                var expired = (expires <= today);

                const embed = new MessageEmbed()
                    // .setTitle(`${name}'s user info!`)
                    // .addField("**PLAN**", `${findPlan(plan)}`, false)
                    // .addField("**EXPIRES**", `${expired === true ? "Plan Expired" : expires}`, false)
                    .addField(`${name}'s user info!`,[
                        `> ❯ PLAN: **${findPlan(plan)}**`,
                        `> ❯ EXPIRES: **${expired === true ? "Plan Expired" : expires}**`,
                    ])
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(0xff1100)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.member.user.displayAvatarURL())
                message.channel.send(embed)

            });
            connection.release();
        });
    }
}