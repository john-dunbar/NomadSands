"use strict";

require("dotenv").config();
const discord = require("discord.js");

const discordClient = new discord.Client();
const guildManager = new discord.GuildManager(discordClient);

class DiscordInterface {
    constructor() {
        discordClient.login(process.env.DISCORD_BOT_TOKEN);
        discordClient.once("ready", () => {
            console.log("Nomad Sands bot ready!");
            console.log(
                "Nomad Sands bot in " + discordClient.guilds.cache.size + " guilds"
            );
            console.log(
                "Bot guild IDs: " +
                discordClient.guilds.cache.each((guild) => {
                    console.log(guild.id);
                })
            );
        });
    }

    getClient() {
        return discordClient;
    }

    async createGuild(sessionId, matchName) {
        let user = await findUser(sessionId);

        //need guild for database insertion in calling function, so await.

        let guildData = await guildManager.create(matchName);
        let guild = await guildManager.resolve(guildData);

        //dont need these just yet and they cause some delay in ajax, so promise.
        guild
            .addMember(user.userId, {
                accessToken: user.accessToken,
            })
            .then(() => guild.setOwner(user.userId))
            .then(() => guild.leave());

        //show that the guildId has been retrieved before moving on
        console.log("guild created about to insert: " + guild.id);
        return guild;
    }

    async createInvite(guildId) {

        var currentGuild = discordClient.guilds.resolve(guildId);

        var targetChannel;

        currentGuild.channels.cache.each((channel) => {

            if (channel.name == "general") {
                if (channel.type == "text") {

                    targetChannel = channel;

                }
            }

        });

        let invite = await targetChannel.createInvite();

        return invite.url;

    }

    async getUserAvatar(guildId, userId) {

        var currentGuild = discordClient.guilds.resolve(guildId);

        var targetUserAvatar;

        currentGuild.members.cache.each((member) => {

            if (member.id == userId) {
                targetUserAvatar = member.user.avatar;
            }

        });

        return targetUserAvatar;

    }

    async getGuildChannels(guildId) {

        var currentGuild = discordClient.guilds.resolve(guildId);


        var channels = [];

        currentGuild.channels.cache.each((channel) => {

            channels.push(channel);

        });

        return channels;

    }

    async isBotMember(guildId) {

        //this prints out only guilds the bot is in

        // discordClient.guilds.cache.each((guild) => {
        //     console.log("Guild in cache: " + guild.name);
        // });

        return discordClient.guilds.cache.has("sagaseg");

    }

    async getGuild(guildId) {

        var currentGuild = await discordClient.guilds.resolve(guildId);

        return currentGuild;

    }

    async getAllBotGuilds() {

        return discordClient.guilds.cache;

    }
}

module.exports = DiscordInterface;
