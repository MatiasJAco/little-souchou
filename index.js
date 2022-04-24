const config = require('./config.json');

const axios = require('axios');
//const Cleverbot = require('clevertype').Cleverbot;

const Discord = require('discord.js');
//const client = new Discord.Client();
//global.discordJsClient = client;

const TwitchMonitor = require("./src/adapters/twitch/twitch-monitor");
const { ChatListener }  = require("./src/adapters/twitch/twitch-chatlistener");
//const FooduseMonitor = require("./fooduse-monitor");
const DiscordChannelSync = require("./src/utils/discord-channel-sync");
//const ElizaHelper = require('./eliza');
const LiveEmbed = require('./src/utils/live-embed');
const MiniDb = require('./src/utils/minidb');
//const TwitchApi = require('./src/adapters/twitch/twitch-api');
const { FlushCommand } = require("./src/engine/commands/flush.command");
// -------------------------------------

const { AppConfig } = require('./app.config');

async function main(){
    const bot = await AppConfig.BOT.startBot(AppConfig);
    client = bot.client.client;

// --- Discord ---------------------------------------------------------------------------------------------------------
console.log('Connecting to Discord...');

let targetChannels = [];
let emojiCache = { };

let getServerEmoji = (emojiName, asText) => {
    if (typeof emojiCache[emojiName] !== "undefined") {
        return emojiCache[emojiName];
    }

    try {
        let emoji = client.emojis.cache.find(e => e.name === emojiName);

        if (emoji) {
            emojiCache[emojiName] = emoji;

            if (asText) {
                return emoji.toString();
            } else {
                return emoji.id;
            }
        }
    } catch (e) {
        console.error(e);
    }

    return null;
};
global.getServerEmoji = getServerEmoji;

 /*let syncServerList = (logMembership) => {
     targetChannels = DiscordChannelSync.getChannelList(client, config.discord_announce_channel, logMembership);
 };*/

client.on('ready', () => {
    console.log('[Discord]', `Bot is ready; logged in as ${client.user.tag}.`);

 //    Init list of connected servers, and determine which channels we are announcing to
   // syncServerList(true);

    // Keep our activity in the user list in sync
   // StreamActivity.init(client);

    // Begin Twitch API polling
    // TwitchMonitor.start();

    // Activate Food Use integration
   // FooduseMonitor.start();
});

// bot.on("guildCreate", guild => {
//     console.log(`[Discord]`, `Joined new server: ${guild.name}`);

//     syncServerList(false);
// });

// bot.on("guildDelete", guild => {
//     console.log(`[Discord]`, `Removed from a server: ${guild.name}`);

//     syncServerList(false);
// });

// let selloutList = [];

// axios.get("https://twitch.center/customapi/quote/list?token=a912f99b")
// .then((res) => {
//     let data = res.data;
//     let lines = data.split("\n");

//     for (let i = 0; i < lines.length; i++) {
//         let line = lines[i];
//         selloutList.push(line);
//     }

//     console.log('[Sellout]', `Sellout list initialized from remote, ${selloutList.length} items`);
// });

// let selloutCheckTs = 0;
// let selloutTimeout = null;

// let doSelloutMessage = (channel) => {
//     if (!selloutList.length) {
//         return;
//     }

//     let randomLine = selloutList[Math.floor(Math.random()*selloutList.length)];

//     if (!randomLine) {
//         return;
//     }

//     let messageText = "Oh. I guess nightbot is out drinking again. I got this. ";
//     messageText += "How many quality Amazon™ products are there? At least ";
//     messageText += randomLine;

//     try {
//         channel.send(messageText);
//         channel.stopTyping(true);
//     } catch (e) {
//         console.error('[Sellout] ERR:', e.toString());
//     }
// };

// let lastTextReplyAt = 0;

// bot.on('message', message => {
//     if (!message.content) {
//         // Empty message
//         return;
//     }

//     let txtPlain = message.content.toString().trim();
//     let txtLower = txtPlain.toLowerCase();

//     if (!txtLower.length) {
//         // Whitespace or blank message
//         return;
//     }

// });



    bot.login(AppConfig.DISCORD_BOT_TOKEN);




 //   syncServerList(true);
   // StreamActivity.init(bot);


// // ---------------------------------------------------------------------------------------------------------------------
// // Live events

let liveMessageDb = new MiniDb('live-messages');
let messageHistory = liveMessageDb.get("history") || { };
//AppConfig.CONFIG_STORAGE.setProperty("kson", 'listening', false);



}

main();
// --- Startup ---------------------------------------------------------------------------------------------------------
//console.log('Timbot is starting.');

// --- Cleverbot init --------------------------------------------------------------------------------------------------
//let cleverbot = null;

//if (config.cleverbot_token) {
//    cleverbot = new Cleverbot({
//        apiKey: config.cleverbot_token,
//        emotion: 0,
//        engagement: 0,
//        regard: 100
//    }, true);
//}

// --- Discord ---------------------------------------------------------------------------------------------------------
// console.log('Connecting to Discord...');

// let targetChannels = [];
// let emojiCache = { };

// let getServerEmoji = (emojiName, asText) => {
//     if (typeof emojiCache[emojiName] !== "undefined") {
//         return emojiCache[emojiName];
//     }

//     try {
//         let emoji = bot.emojis.cache.find(e => e.name === emojiName);

//         if (emoji) {
//             emojiCache[emojiName] = emoji;

//             if (asText) {
//                 return emoji.toString();
//             } else {
//                 return emoji.id;
//             }
//         }
//     } catch (e) {
//         console.error(e);
//     }

//     return null;
// };
// global.getServerEmoji = getServerEmoji;

// let syncServerList = (logMembership) => {
//     targetChannels = DiscordChannelSync.getChannelList(bot, config.discord_announce_channel, logMembership);
// };

// bot.on('ready', () => {
//     console.log('[Discord]', `Bot is ready; logged in as ${bot.user.tag}.`);

//  //    Init list of connected servers, and determine which channels we are announcing to
//     syncServerList(true);

//     // Keep our activity in the user list in sync
//     StreamActivity.init(bot);

//     // Begin Twitch API polling
//      TwitchMonitor.start();

//     // Activate Food Use integration
//    // FooduseMonitor.start();
// });

// bot.on("guildCreate", guild => {
//     console.log(`[Discord]`, `Joined new server: ${guild.name}`);

//     syncServerList(false);
// });

// bot.on("guildDelete", guild => {
//     console.log(`[Discord]`, `Removed from a server: ${guild.name}`);

//     syncServerList(false);
// });

// let selloutList = [];

// axios.get("https://twitch.center/customapi/quote/list?token=a912f99b")
// .then((res) => {
//     let data = res.data;
//     let lines = data.split("\n");

//     for (let i = 0; i < lines.length; i++) {
//         let line = lines[i];
//         selloutList.push(line);
//     }

//     console.log('[Sellout]', `Sellout list initialized from remote, ${selloutList.length} items`);
// });

// let selloutCheckTs = 0;
// let selloutTimeout = null;

// let doSelloutMessage = (channel) => {
//     if (!selloutList.length) {
//         return;
//     }

//     let randomLine = selloutList[Math.floor(Math.random()*selloutList.length)];

//     if (!randomLine) {
//         return;
//     }

//     let messageText = "Oh. I guess nightbot is out drinking again. I got this. ";
//     messageText += "How many quality Amazon™ products are there? At least ";
//     messageText += randomLine;

//     try {
//         channel.send(messageText);
//         channel.stopTyping(true);
//     } catch (e) {
//         console.error('[Sellout] ERR:', e.toString());
//     }
// };

// let lastTextReplyAt = 0;

// bot.on('message', message => {
//     if (!message.content) {
//         // Empty message
//         return;
//     }

//     let txtPlain = message.content.toString().trim();
//     let txtLower = txtPlain.toLowerCase();

//     if (!txtLower.length) {
//         // Whitespace or blank message
//         return;
//     }

// });

// console.log('[Discord]', 'Logging in...');
// bot.login(config.discord_bot_token);


 // Activity updater
 class StreamActivity {
    /**
     * Registers a channel that has come online, and updates the user activity.
     */
    static setChannelOnline(stream) {
        this.onlineChannels[stream.user_name] = stream;

         this.updateActivity();
     }

//     /**
//      * Marks a channel has having gone offline, and updates the user activity if needed.
//      */
     static setChannelOffline(stream) {
         delete this.onlineChannels[stream.user_name];

         this.updateActivity();
     }

//     /**
//      * Fetches the channel that went online most recently, and is still currently online.
//      */
     static getMostRecentStreamInfo() {
         let lastChannel = null;
         for (let channelName in this.onlineChannels) {
             if (typeof channelName !== "undefined" && channelName) {
                 lastChannel = this.onlineChannels[channelName];
             }
         }
         return lastChannel;
     }

//     /**
//      * Updates the user activity on Discord.
//      * Either clears the activity if no channels are online, or sets it to "watching" if a stream is up.
//      */
     static updateActivity() {
         let streamInfo = this.getMostRecentStreamInfo();

         if (streamInfo) {
             this.discordClient.user.setActivity(streamInfo.user_name, {
                 "url": `https://twitch.tv/${streamInfo.user_name.toLowerCase()}`,
                 "type": "STREAMING"
             });

             console.log('[StreamActivity]', `Update current activity: watching ${streamInfo.user_name}.`);
         } else {
             console.log('[StreamActivity]', 'Cleared current activity.');

             this.discordClient.user.setActivity(null);
         }
     }

     static init(discordClient) {
         this.discordClient = discordClient;
         this.onlineChannels = { };

         this.updateActivity();

         // Continue to update current stream activity every 5 minutes or so
         // We need to do this b/c Discord sometimes refuses to update for some reason
         // ...maybe this will help, hopefully
         setInterval(this.updateActivity.bind(this), 5 * 60 * 1000);
     }
 }

// // // ---------------------------------------------------------------------------------------------------------------------
// // // Live events

// let liveMessageDb = new MiniDb('live-messages');
// let messageHistory = liveMessageDb.get("history") || { };

// TwitchMonitor.onChannelLiveUpdate((streamData) => {
//     const isLive = streamData.type === "live";

//     // Refresh channel list
//     try {
//         syncServerList(false);
//     } catch (e) { }

//     // Update activity
//     StreamActivity.setChannelOnline(streamData);

//     // Generate message
//     const msgFormatted = `${streamData.user_name} went live on Twitch!`;
//     const msgEmbed = LiveEmbed.createForStream(streamData);

//     // Broadcast to all target channels
//     let anySent = false;

//     for (let i = 0; i < targetChannels.length; i++) {
//         const discordChannel = targetChannels[i];
//         const liveMsgDiscrim = `${discordChannel.guild.id}_${discordChannel.name}_${streamData.id}`;

//         if (discordChannel) {
//             try {
//                 // Either send a new message, or update an old one
//                 let existingMsgId = messageHistory[liveMsgDiscrim] || null;

//                 if (existingMsgId) {
//                     // Fetch existing message
//                     discordChannel.messages.fetch(existingMsgId)
//                       .then((existingMsg) => {
//                         existingMsg.edit(msgFormatted, {
//                           embed: msgEmbed
//                         }).then((message) => {
//                           // Clean up entry if no longer live
//                           if (!isLive) {
//                             delete messageHistory[liveMsgDiscrim];
//                             liveMessageDb.put('history', messageHistory);
//                           }
//                         });
//                       })
//                       .catch((e) => {
//                         // Unable to retrieve message object for editing
//                         if (e.message === "Unknown Message") {
//                             // Specific error: the message does not exist, most likely deleted.
//                             delete messageHistory[liveMsgDiscrim];
//                             liveMessageDb.put('history', messageHistory);
//                             // This will cause the message to be posted as new in the next update if needed.
//                         }
//                       });
//                 } else {
//                     // Sending a new message
//                     if (!isLive) {
//                         // We do not post "new" notifications for channels going/being offline
//                         continue;
//                     }

//                     // Expand the message with a @mention for "here" or "everyone"
//                     // We don't do this in updates because it causes some people to get spammed
//                     let mentionMode = (config.discord_mentions && config.discord_mentions[streamData.user_name.toLowerCase()]) || null;

//                     if (mentionMode) {
//                         mentionMode = mentionMode.toLowerCase();

//                         if (mentionMode === "everyone" || mentionMode === "here") {
//                             // Reserved @ keywords for discord that can be mentioned directly as text
//                             mentionMode = `@${mentionMode}`;
//                         } else {
//                             // Most likely a role that needs to be translated to <@&id> format
//                             let roleData = discordChannel.guild.roles.cache.find((role) => {
//                                 return (role.name.toLowerCase() === mentionMode);
//                             });

//                             if (roleData) {
//                                 mentionMode = `<@&${roleData.id}>`;
//                             } else {
//                                 console.log('[Discord]', `Cannot mention role: ${mentionMode}`,
//                                   `(does not exist on server ${discordChannel.guild.name})`);
//                                 mentionMode = null;
//                             }
//                         }
//                     }

//                     let msgToSend = msgFormatted;

//                     if (mentionMode) {
//                         msgToSend = msgFormatted + ` ${mentionMode}`
//                     }

//                     let msgOptions = {
//                         embed: msgEmbed
//                     };

//                     discordChannel.send(msgToSend, msgOptions)
//                         .then((message) => {
//                             console.log('[Discord]', `Sent announce msg to #${discordChannel.name} on ${discordChannel.guild.name}`)

//                             messageHistory[liveMsgDiscrim] = message.id;
//                             liveMessageDb.put('history', messageHistory);
//                         })
//                         .catch((err) => {
//                             console.log('[Discord]', `Could not send announce msg to #${discordChannel.name} on ${discordChannel.guild.name}:`, err.message);
//                         });
//                 }

//                 anySent = true;
//             } catch (e) {
//                 console.warn('[Discord]', 'Message send problem:', e);
//             }
//         }
//     }

//     liveMessageDb.put('history', messageHistory);
//     return anySent;
// });

//  TwitchMonitor.onChannelOffline((streamData) => {
//      // Update activity
//      StreamActivity.setChannelOffline(streamData);
//  });

// --- Common functions ------------------------------------------------------------------------------------------------
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.spacifyCamels = function () {
    let target = this;

    try {
        return target.replace(/([a-z](?=[A-Z]))/g, '$1 ');
    } catch (e) {
        return target;
    }
};

Array.prototype.joinEnglishList = function () {
    let a = this;

    try {
        return [a.slice(0, -1).join(', '), a.slice(-1)[0]].join(a.length < 2 ? '' : ' and ');
    } catch (e) {
        return a.join(', ');
    }
};

String.prototype.lowercaseFirstChar = function () {
    let string = this;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

Array.prototype.hasEqualValues = function (b) {
    let a = this;

    if (a.length !== b.length) {
        return false;
    }

    a.sort();
    b.sort();

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}


// main();