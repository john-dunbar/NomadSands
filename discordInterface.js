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
    console.log("guild id " + guildId);
    var currentGuild = discordClient.guilds.resolve(guildId);
    //var url = "no invite url found";
    var targetChannel;

    currentGuild.channels.cache.each((channel) => {
      if (channel.name == "general") {
        console.log("found general name in " + channel.id);
        if (channel.type == "text") {
          console.log("bingo! " + channel.id);

          targetChannel = channel;

          //let invite = await channel.createInvite();

          //url =invite.url;

          //console.log("invite: "+invite.url);

          //channel.createInvite().then((invite) =>{
          //    console.log(`Created an invite with a url of ${invite.url}`);
          //    return invite.url;
          //  }).catch(console.error);
        }
      }
      console.log("channel " + channel.id);
    });

    console.log("target: "+targetChannel.id);

    let url = await targetChannel.createInvite().url;
    console.log("url: "+url);
    return url;
  }
}

module.exports = DiscordInterface;
