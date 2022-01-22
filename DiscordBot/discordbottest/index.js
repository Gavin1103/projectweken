const Discord = require('discord.js');
const botConfig = require("./botConfig.json");
const levelFile = require("./data/lvl.json");
const fs = require('fs');
const client = new Discord.Client();
client.commands = new Discord.Collection();


fs.readdir('./commands/', (err, files) => {

    if (err) console.log(err);
    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("geen files gevonden");
        return;
    }
    jsFiles.forEach((f, i) => {
        var fileGet = require(`./commands/${f}`);
        console.log(`de file ${f} is geladen`);
        client.commands.set(fileGet.help.name, fileGet);
    })
});


client.on('ready', async() => {
    console.log(`${client.user.username} is online`);
});


client.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0];
    var arguments = messageArray.slice(1);
    var commands = client.commands.get(command.slice(prefix.length));

    if (commands) commands.run(client, message, arguments);
});

// scheldwoordenFilter
client.on("message", async message => {
    if (message.channel.type === "dm" || message.author.bot) return;
    randomXp(message)

    const logChannel = client.channels.cache.find(channel => channel.id === "910488308411400242");
    let words = ["nigger", "orange"];

    let foundInText = false;
    for (var i in words) {
        if (message.content.toLowerCase().includes(words[i].toLowerCase())) foundInText = true;
    }

    if (foundInText) {
        let logEmbed = new Discord.MessageEmbed()
            .setDescription(`<@${message.author.id}>Said a bad word`)
            .addField('The message', message.content)
            .addField('Channel', message.guild.channels.cache.get(message.channel.id).toString())
            .setColor('RANDOM')
            .setTimestamp()
        logChannel.send(logEmbed)

        let embed = new Discord.MessageEmbed()
            .setDescription(`You cannot say that here`)
            .setColor('RANDOM')
            .setTimestamp()
        let msg = await message.channel.send(embed);
        message.delete();
        // msg.delete()
    }
});


function randomXp(message) {
    var randomNumber = Math.floor(Math.random() * 15) + 1;
    var idUser = message.author.id;
    if (!levelFile[idUser]) {
        levelFile[idUser] = {
            xp: 0,
            level: 0
        }
    }
    levelFile[idUser].xp += randomNumber;
    var levelUser = levelFile[idUser].level;
    var xpUser = levelFile[idUser].xp;



    var nextLevelXp = levelUser * 300;

    if (nextLevelXp == 0) nextLevelXp = 100;
    if (xpUser >= nextLevelXp) {

        levelFile[idUser].level += 1;
        fs.writeFile("./data/lvl.json", JSON.stringify(levelFile), err => {
            if (err) console.log(err);
        });
        var emebedLevel = new Discord.MessageEmbed()
            .setDescription("***Level hoger!***")
            .setColor("GREEN")
            .addField("Nieuw level: ", levelFile[idUser].level);
        message.channel.send(emebedLevel);

    }
}


client.login(botConfig.token);