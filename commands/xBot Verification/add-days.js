const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../config.json")

function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
module.exports = {
    name: "add-days",
    description: "add time to a user",
    usage: `${prefix}add-days <user> [Time]`,
    example: `${prefix}add-days @timmy 5d`,
    category: "⚙️ | utility",
    memberpermissions: "ADMINISTRATOR",
    run: async (client, message, args, pool) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            var target = message.mentions.users.first();
            if (!target) return message.channel.send(new MessageEmbed()
                .setColor(0xff1100)
                .setTimestamp()
                .setFooter(message.author.tag, message.member.user.displayAvatarURL())
                .setTitle("❌ Error | Please specify a user!")
            ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))

            connection.query(`select * from users where discordid='${target.id}'`, (err, rows) => {
                if (err) throw err;

                var query = '';

                /* checks if the user in the db */
                if (rows.length < 1) {
                    return message.channel.send(new MessageEmbed()
                        .setColor(0xff1100)
                        .setTimestamp()
                        .setFooter(message.author.tag, message.member.user.displayAvatarURL())
                        .setTitle("❌ Error | user not found!")
                    ).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))
                }
                else {
                    let days = parseInt(args[1]);
                    let expires = rows[0].expires;
                    var expired = (expires <= new Date());
                    var end_date = (expired === true ? addDays(new Date(), days) : addDays(expires, days));
                    query = `update users set expires='${formatDate(end_date)}' where discordid='${target.id}'`;
                    message.channel.send(
                        {
                            embed: {
                                description: "Timed Added!",
                                color: 0xff1100,
                            }
                        }).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))
                }
                connection.query(query);
            });
            connection.release();
        });
    }
}