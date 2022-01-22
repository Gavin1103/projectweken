const Discord = require('discord.js');
module.exports.run = async(client, message, args) => {
    const categoryID = "913413950434054146";
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("jij kan dit niet gebruiken");
    if (message.channel.parentID == categoryID) {
        message.channel.delete();
        var embedCreateTicket = new Discord.MessageEmbed()
            .setTitle("Ticket, " + message.channel.name)
            .setDescription("Het ticket is gemarkeerd als **compleet**")
            .setFooter("Ticket gesloten");
        var ticketChannel = message.member.guild.channels.cache.find(channel => channel.name === "log");
        if (!ticketChannel) return message.reply("kanaal bestaat niet");
        ticketChannel.send(embedCreateTicket);
    } else {
        message.channel.send("Deze commend kun je alleen bij een Ticket kanaal gebruiken");
    }
}
module.exports.help = {
    name: "close"
}