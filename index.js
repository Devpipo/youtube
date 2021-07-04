require("dotenv").config();

const { Client } = require("discord.js");
const fetch = require("node-fetch");
const client = new Client();
const tokne = process.env.TOKEN;
const PREFIX = "$";

const ACTIVITIES = {
    "poker": {
        id: "755827207812677713",
        name: "Poker Night"
    },
    "betrayal": {
        id: "773336526917861400",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "755600276941176913",
        name: "YouTube Together"
    },
    "fishington": {
        id: "814288819477020702",
        name: "Fishington.io"
    }
};

client.on("ready", () => console.log("Bot is online!"));
client.on('ready', () => {
    const statuses = [
        () => `${PREFIX}help | By ! 𝙋𝙄𝙋𝙊𝘿𝙍𝘼𝙒`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'STREAMING',
    url: 'https://twitch.tv/pipodraw_'})
        i = ++i % statuses.length
    }, 1e4)
});
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") return message.channel.send(`Pong! \`${client.ws.ping}ms\``);
    if (cmd === "owner") return message.channel.send(`Mon créateur est : <@700733815756161088> Ou contacter : ! 𝙋𝙄𝙋𝙊𝘿𝙍𝘼𝙒#0001`)
    if (cmd === "help") return message.channel.send(`Pannel de help : \n$youtube + \`\`Channel_id\`\`\n$ping\n$help-play\n$owner`);
    if (cmd === "help-play") return message.channel.send(`Help play :\n$play + \`\`Channel_id\`\` + **youtube**\n$play + \`\`Channel_id\`\` + **poker**\n$play + \`\`Channel_id\`\`+ **betrayal**\n$play + \`\`Channel_id\`\`+ **fishington**`)

    if (cmd === "yttogether") {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | Salon invalide donner!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | j'ai besoins des permission : `CREER_UNE_INVITATION`");

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913", // youtube together
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("❌ | Impossible de lancer **YouTube Together**!");
                message.channel.send(`✅ | Cliquez ici pour démarrer **YouTube Together** in ${channel.name}: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send("❌ | Imposible de lancer **YouTube Together**!");
            })
    }
    
    // or use this
    if (cmd === "play") {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | Salon invalide donner!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | j'ai besoins des permission : `CREER_UNE_INVITATION`");
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        if (!activity) return message.channel.send(`❌ | Formats correct:\n${Object.keys(ACTIVITIES).map(m => `**${PREFIX}play <Channel_ID> ${m}**`).join("\n")}`);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send(`❌ | Impossible de lancer **${activity.name}**!`);
                message.channel.send(`✅ | Cliquez ici pour démarrer **${activity.name}** in **${channel.name}**: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send(`❌ | Imposible de lancer **${activity.name}**!`);
            })
    }
});

client.login(token);
