const Discord = require('discord.js');
const botConfig = require("../botConfig.json");

module.exports.run = async(client, message, args) => {

    var prefix = botConfig.prefix;
    var args = message.content.slice(prefix.length).split(/ +/);

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("jij kan dit niet gebruiken");
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("geen perms");
    if (!args[1]) return message.reply("geen gebruiker opgegeven");
    if (!args[2]) return message.reply("geen redenen opgegeven");

    var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    var reason = args.slice(2).join(" ");

    if (!banUser) return message.reply("gebruiker niet gevonden");
    if (banUser.hasPermission("MANAGE_MESSAGES")) return message.reply("je kunt deze gebruiker niet verbannen");

    var embedPrompt = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("binnen 60 sec reageren")
        .setDescription(`wil je ${banUser} bannen?`)

    var embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setFooter(message.member.displayName)
        .setTimestamp()
        .setDescription(`**Gebannend: ** ${banUser} (${banUser.id})
        **Gebannemnd door:** ${message.author}
        **Redenen: ** ${reason}`);

    message.channel.send(embedPrompt).then(async msg => {

        var emoji = await promptMessage(msg, message.author, 60, ["✅", "❌"]);
        if (emoji === "✅") {
            msg.delete();
            banUser.ban(reason).catch(err => {
                if (err) return message.reply("er is iets fout gegaan");
            });
            message.channel.send(embed);
        }

        if (emoji === "❌") {
            msg.delete();
            message.reply("ban geannuleerd");
            // .then(m => m.delete(5000)
        }
    });


    async function promptMessage(message, author, time, reactions) {
        time *= 1000;
        for (const reaction of reactions) {
            await message.react(reaction);

        }
        var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;
        return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
    }
}

module.exports.help = {
    name: "ban"
}