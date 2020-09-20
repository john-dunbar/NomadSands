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
        });
    }

    getClient() {
        return discordClient;
    }

    async createInvite(guildId) {
        let currentGuild = discordClient.guilds.resolve(guildId);
        let targetChannel;
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
        let currentGuild = discordClient.guilds.resolve(guildId);
        let targetUserAvatar;
        currentGuild.members.cache.each((member) => {
            if (member.id == userId) {
                targetUserAvatar = member.user.avatar;
            }
        });
        return targetUserAvatar;
    }

    async getGuildChannels(guildId) {
        let currentGuild = discordClient.guilds.resolve(guildId);
        let channels = [];
        currentGuild.channels.cache.each((channel) => {
            channels.push(channel);
        });
        return channels;
    }

    async isBotMember(guildId) {
        let isMember = discordClient.guilds.cache.has(guildId);
        return isMember;
    }

    async getGuild(guildId) {
        let currentGuild = await discordClient.guilds.resolve(guildId);
        return currentGuild;
    }

    async getAllBotGuilds() {
        return discordClient.guilds.cache;
    }
}

module.exports = DiscordInterface;
