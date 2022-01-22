const Discord = require('discord.js');
const fs = require("fs");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async(client, message, args) => {

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("jij kan dit niet gebruiken");
    if (!args[0]) return message.reply("geen gebruiker opgegeven");
    if (!args[1]) return message.reply("geen redenen opgegeven");
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("geen perms");

    var warnUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply("gebruiker niet gevonden");
    if (warnUser.hasPermission("MANAGE_MESSAGES")) return message.reply("je kunt deze gebruiker niet waarschuwen");
    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    };

    warns[warnUser.id].warns++;

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {

        if (err) console.log(err);

    });

    var embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**gewarnd: ** ${warnUser} (${warnUser.id})
    **waarschuwing van:** ${message.author}
    **Redenen: ** ${reason}`)
        .addField("Aantal waarschuwingen", warns[warnUser.id].warns);

    var channel = message.member.guild.channels.cache.get("910488308411400242");
    if (!channel) return;
    channel.send(embed);





    if (warns[warnUser.id].warns == 3) {

        var embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`${warnUser} PAS OP`)
            .addField("Bericht", "Nog 1 waarschuwing voor kick/ban");

        message.channel.send(embed);

    } else if (warns[warnUser.id].warns == 4) {

        message.guild.member(warnUser).ban(reason);
        var embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`${warnUser} IS VERBANNEN`)
            .addField("Bericht", "is verbannen door bot wegens te veel waarschuwingen");
        message.channel.send(embed);
    }


}

module.exports.help = {
    name: "warn"
}