const ee = require("../../config.json");

module.exports = {
    name: "verify",
    description: "A command which connects Discord account to the bot",
    category: "⚙️ | utility",
    run: async (client, message, args, pool) => {
        pool.getConnection(async (err, connection) => {
            if (err) throw err;
        
            var target = message.author;

            if (!args[0] || args[0].length != 8 || args[0].length > 8) {
                message.reply('').then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))
            }
            else {
                connection.query(`select * from users where discordcode='${args[0]}' and discordid='${target.id}'`, async (err, rows) => {
                    if (err) throw err;

                    var query = '';

                    if (rows.length < 1) {
                       // return as none
                    }
                    else {
                        query = `update users set discordverified='1' where discordid='${target.id}' and discordcode='${args[0]}'`;
                        message.channel.send(
                            { 
                                embed: {
                                    description: `${target} has been verified!`,
                                    color: ee.color,
                                }
                        }).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))
                    }
                    connection.query(query);
                });
            }
            await message.delete()
            connection.release();
        });
    }
}