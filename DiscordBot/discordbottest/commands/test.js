const Discord = require('discord.js');

module.exports.run = async(client, message, args) => {

    return message.channel.send("Hoi");

}

module.exports.help = {
    name: "hallo"
}