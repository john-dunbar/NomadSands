"use strict";

require('dotenv').config();
const discord = require('discord.js');

const discordClientdiscordClient = new discord.Client();
const guildManager = new discord.GuildManager(discordClient);

class DiscordInterface {

    constructor() {

        discordClient.login(process.env.DISCORD_BOT_TOKEN);
        discordClient.once('ready', () => {
            console.log('Nomad Sands bot ready!');
            console.log("Nomad Sands bot in " + discordClient.guilds.cache.size + " guilds");
            console.log("Bot guild IDs: " + discordClient.guilds.cache.each(guild => {
                console.log(guild.id);
            }));


        });
    }

    async createGuild(sessionId, matchName) {

        let user = await findUser(sessionId);

        //need guild for database insertion in calling function, so await.

        let guildData = await guildManager.create(matchName);
        let guild = await guildManager.resolve(guildData);

        //dont need these just yet and they cause some delay in ajax, so promise.
        guild.addMember(user.userId, {
                'accessToken': user.accessToken,
            })
            .then(() => guild.setOwner(user.userId))
            .then(() => guild.leave())

        //show that the guildId has been retrieved before moving on
        console.log("guild created about to insert: " + guild.id);
        return guild;

    }

}

module.exports = DiscordInterface;
