module.exports = {
    name: "verify",
    description: "A command which connects Discord account to the bot",
    category: "⚙️ | utility",
    run: async (client, message, args, pool) => {
        pool.getConnection((err, connection) => {
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
                        // console.log("user verified!");
                        target.send(
                            { 
                                embed: {
                                    description: `${target} verified!`,
                                    color: 0xff1100,
                                }
                        }).then(msg => msg.delete({ timeout: 10000 }).catch(e => console.log(e.message)))
                    }
                    await message.delete()
                    connection.query(query);
                });
            }

            connection.release();
        });
    }
}