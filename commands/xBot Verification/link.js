const { MessageEmbed } = require("discord.js");
const ee = require("../../config.json");
const { prefix } = require("../../config.json")

function genCode(len) {
    var out = '';
    var possible = '0123456789ABCDEFHI';
    for (var i = 0; i < len; i++)
        out += possible.charAt(Math.floor(Math.random() * possible.length));
    return out;
}

module.exports = {
    name: "link",
    description: "A command which connects Discord account to the bot",
    category: "⚙️ | utility",
    run: async (client, message, args, pool) => {
        pool.getConnection(async (err, connection) => {
            if (err) throw err;

            var target = message.author;
            var unique = genCode(8);

            await message.delete()
            connection.query(`select * from users where discordid='${target.id}'`, (err, rows) => {
                if (err) throw err;

                var query = '';

                if (rows.length < 1) {
                    query = `insert into users (name, discordid, discordcode) values ('${target.username}', '${target.id}', '${unique}')`;
                    // console.log("user created, pending verification!")
                    target.send(
                        {
                            embed: {
                                title: "Please verify your account with this one time code",
                                description: `Here's your verify code: \`${prefix}verify ${unique}\``,
                                color: ee.color
                            }
                        })
                }
                else {
                    // return as none
                }
                connection.query(query);
            });
            connection.release();
        });
    }
}