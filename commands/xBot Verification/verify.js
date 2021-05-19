module.exports = {
    name: "verify",
    description: "A command which connects Discord account to the bot",
    category: "⚙️ | utility",
    run: async (client, message, args, pool) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;
        
            var target = message.author;

            if (!args[0] || args[0].length != 8 || args[0].length > 8) {
                message.reply('').then(msg => {
                    msg.delete({ timeout: 15000 });
                });
            }
            else {
                connection.query(`select * from users where discordcode='${args[0]}' and discordid='${target.id}'`, (err, rows) => {
                    if (err) throw err;

                    var query = '';

                    if (rows.length < 1) {
                        // empty
                    }
                    else {
                        query = `update users set discordverified='1' where discordid='${target.id}' and discordcode='${args[0]}'`;
                        console.log("user verified!");
                    }
                    
                    connection.query(query);
                });
            }

            connection.release();
        });
    }
}