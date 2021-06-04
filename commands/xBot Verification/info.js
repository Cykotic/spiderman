const { MessageEmbed } = require('discord.js');
const ee = require("../../config.json");
function findPlan(plan) {
    switch (plan) {
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
    channelOnly: true,
    run: async (client, message, args, pool) => {
        pool.getConnection(async (err, connection) => {
            if (err) throw err;

            var target = message.author || message.guild.members.get(args[0]);

            connection.query(`select * from users where discordid='${target.id}'`, async (err, rows) => {
                if (err) throw err;

                var verified = rows[0].discordverified;

                if (verified === 0)
                    return message.reply(new MessageEmbed()
                        .setTitle("❌ Error | you have not verified your discord account with the bot!!")
                        .setColor(ee.color)
                        .setTimestamp()
                        .setFooter(message.author.tag, message.member.user.displayAvatarURL())
                    ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

                var name = rows[0].name;
                var plan = rows[0].plan;
                var expires = new Date(rows[0].expires);
                var today = new Date();
                var expired = (expires <= today);

                const embed = new MessageEmbed()
                    .addField(`${name}'s user info!`, [
                        `> ❯ PLAN: **${findPlan(plan)}**`,
                        `> ❯ EXPIRES: **${expired === true ? "Plan Expired" : expires}**`,
                    ])
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(ee.color)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.member.user.displayAvatarURL())
                message.reply(embed)

            });
            await message.delete()
            connection.release();
        });
    }
}