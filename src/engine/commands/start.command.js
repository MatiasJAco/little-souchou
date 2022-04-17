const { AppConfig } = require("../../../app.config");
const { sanitize } = require("../../adapters/mildom/mildom.client");
const { FlushCommand } = require("./flush.command");
const { Command, HelpTip } = require('../../models/command');
const { Timestamp } = require("../../models/timestamp");
const { LiteralConstants } = require('../../utils/literal.constants');
const { Logger } = require('../../utils/logger');
const oneline = require('oneline');

//---nuevos
const config = require('../../../config.json');

const axios = require('axios');
//const Cleverbot = require('clevertype').Cleverbot;

const Discord = require('discord.js');
//const client = new Discord.Client();
//global.discordJsClient = client;

const TwitchMonitor = require('../../adapters/twitch/twitch-monitor');
//const FooduseMonitor = require("./fooduse-monitor");
const DiscordChannelSync = require("../../utils/discord-channel-sync");
//const ElizaHelper = require('./eliza');
const LiveEmbed = require('../../utils/live-embed');
const MiniDb = require('../../utils/minidb');

//-----------

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['start', 'listen', 'l'],
        2,
        async (message, args, override) => { 
            
            // const configKey = override ? override : message;
            // const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            // const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
            // const startEpoch = Date.parse(new Date());
            // const streamer = Number(appConfig.CONFIG_STORAGE.getProperty(configKey, 'streamer'));
            // logger.log(`Starting listener for streamer: ${streamer}!`)
            // const listener = await appConfig.MILDOM_CLIENT.startListener(
            // appConfig,
            // streamer, 
            // // on message
            // async (comment) => {
            //     // console.log(comment);
            //     const channels = appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat;
            //     const users = appConfig.CONFIG_STORAGE.getProperty(configKey, "users");
            //     for(let language in channels){
            //         if(comment.authorId == streamer
            //         || (users.includes(comment.authorId) 
            //         && comment.message.toLowerCase().startsWith(`[${language.toLowerCase()}]`))){
            //             if(comment.time > startEpoch){
            //                 const liveInfo = await listener.getLiveStatus();
            //                 if(liveInfo.isMembership() == false){ // bypass all this if it's membership only
            //                     const chatChannel = appConfig.DISCORD_HELPERS.getChannel(guild, channels[language]);
            //                     if(chatChannel){
            //                         const emotes = appConfig.CONFIG_STORAGE.getProperty(configKey, "emotes");
            //                         // TODO: handle when there are 0 properties on the object
            //                         const emotePairs = emotes ? [...Object.entries(emotes)] : [];
            //                         comment.message = sanitize(comment.message, emotePairs);
            //                         logger.log(`Posting: ${JSON.stringify(comment)} in channel: ${chatChannel.id}`);
            //                         const embed = await chatChannel.send({ embeds: [appConfig.DISCORD_HELPERS.generateEmbed(comment)]});
            //                         // post message to timestamps log if we're live
            //                         if(comment.shouldLog == true && liveInfo.isLive()){
            //                             const now = Date.parse(new Date())
            //                             const timestamp = new Timestamp(liveInfo.startTime, now, 0, 0, `${comment.authorName}: ${comment.message}`);
            //                             appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, language, embed.id, timestamp);
            //                         }
            //                     }
            //                 }else{
            //                     logger.log(`Bypassing post because stream is membership-only.`);
            //                     logger.log(JSON.stringify(comment));
            //                     return;
            //                 }
            //             }
            //         }
            //     }
            // },
            // // on go live
            // async (live) => {
            //     const alertRole = appConfig.DISCORD_HELPERS.getRole(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'role').alert);
            //     const alertChannel = appConfig.DISCORD_HELPERS.getChannel(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').alert);
            //     if(alertChannel){
            //         const post = `${alertRole ? alertRole : 'NOW LIVE:'}${live.isMembership() ? ' (Membership Only)' : ''} https://www.mildom.com/${streamer}`;
            //         logger.log(`Posting: ${post} in channel: ${alertChannel.id}`);
            //         alertChannel.send({content: post });
            //     }
            // },
            // // on live end
            // async (live) => {
            //     await FlushCommand(appConfig).callback(message, args, override);
            // },
            // // on open
            // async () => {
            //     if(guild && guild.me){
            //         guild.me.setNickname(LiteralConstants.BOT_NAME_ONLINE);
            //     }
            // },
            // // on close
            // async () => {
            //     if(guild && guild.me){
            //         guild.me.setNickname(LiteralConstants.BOT_NAME_OFFLINE);
            //     }
            // },
            // logger);

            // await message.channel.send({content: `Starting listener.`});
            // appConfig.LISTENER_STORAGE.setListener(configKey, listener);
            // appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', true);
            // logger.log(`Listener instantiated.`);

            // // flush if stream is offline when start up (IE, bot went down and we missed the onLiveEnd event)
            // const liveStatus = await listener.getLiveStatus()
            // if(!liveStatus.isLive()){
            //     await FlushCommand(appConfig).callback(message, args, override);
            // }


            //------------------- Deteccion stream -------------------

            //     // Begin Twitch API polling
           TwitchMonitor.start();

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

// // ---------------------------------------------------------------------------------------------------------------------
// // Live events

let liveMessageDb = new MiniDb('live-messages');
let messageHistory = liveMessageDb.get("history") || { };

TwitchMonitor.onChannelLiveUpdate((streamData) => {
    const isLive = streamData.type === "live";

    // Refresh channel list
    try {
        syncServerList(false);
    } catch (e) { }

    // Update activity
    StreamActivity.setChannelOnline(streamData);

    // Generate message
    const msgFormatted = `${streamData.user_name} went live on Twitch!`;
    const msgEmbed = LiveEmbed.createForStream(streamData);

    // Broadcast to all target channels
    let anySent = false;

    for (let i = 0; i < targetChannels.length; i++) {
        const discordChannel = targetChannels[i];
        const liveMsgDiscrim = `${discordChannel.guild.id}_${discordChannel.name}_${streamData.id}`;

        if (discordChannel) {
            try {
                // Either send a new message, or update an old one
                let existingMsgId = messageHistory[liveMsgDiscrim] || null;

                if (existingMsgId) {
                    // Fetch existing message
                    discordChannel.messages.fetch(existingMsgId)
                      .then((existingMsg) => {
                        existingMsg.edit(msgFormatted, {
                          embed: msgEmbed
                        }).then((message) => {
                          // Clean up entry if no longer live
                          if (!isLive) {
                            delete messageHistory[liveMsgDiscrim];
                            liveMessageDb.put('history', messageHistory);
                          }
                        });
                      })
                      .catch((e) => {
                        // Unable to retrieve message object for editing
                        if (e.message === "Unknown Message") {
                            // Specific error: the message does not exist, most likely deleted.
                            delete messageHistory[liveMsgDiscrim];
                            liveMessageDb.put('history', messageHistory);
                            // This will cause the message to be posted as new in the next update if needed.
                        }
                      });
                } else {
                    // Sending a new message
                    if (!isLive) {
                        // We do not post "new" notifications for channels going/being offline
                        continue;
                    }

                    // Expand the message with a @mention for "here" or "everyone"
                    // We don't do this in updates because it causes some people to get spammed
                    let mentionMode = (config.discord_mentions && config.discord_mentions[streamData.user_name.toLowerCase()]) || null;

                    if (mentionMode) {
                        mentionMode = mentionMode.toLowerCase();

                        if (mentionMode === "everyone" || mentionMode === "here") {
                            // Reserved @ keywords for discord that can be mentioned directly as text
                            mentionMode = `@${mentionMode}`;
                        } else {
                            // Most likely a role that needs to be translated to <@&id> format
                            let roleData = discordChannel.guild.roles.cache.find((role) => {
                                return (role.name.toLowerCase() === mentionMode);
                            });

                            if (roleData) {
                                mentionMode = `<@&${roleData.id}>`;
                            } else {
                                console.log('[Discord]', `Cannot mention role: ${mentionMode}`,
                                  `(does not exist on server ${discordChannel.guild.name})`);
                                mentionMode = null;
                            }
                        }
                    }

                    let msgToSend = msgFormatted;

                    if (mentionMode) {
                        msgToSend = msgFormatted + ` ${mentionMode}`
                    }

                    let msgOptions = {
                        embed: msgEmbed
                    };

                    discordChannel.send(msgToSend, msgOptions)
                        .then((message) => {
                            console.log('[Discord]', `Sent announce msg to #${discordChannel.name} on ${discordChannel.guild.name}`)

                            messageHistory[liveMsgDiscrim] = message.id;
                            liveMessageDb.put('history', messageHistory);
                        })
                        .catch((err) => {
                            console.log('[Discord]', `Could not send announce msg to #${discordChannel.name} on ${discordChannel.guild.name}:`, err.message);
                        });
                }

                anySent = true;
            } catch (e) {
                console.warn('[Discord]', 'Message send problem:', e);
            }
        }
    }

    liveMessageDb.put('history', messageHistory);
    return anySent;
});

 TwitchMonitor.onChannelOffline((streamData) => {
     // Update activity
     StreamActivity.setChannelOffline(streamData);
 });

        }, 
        [
            new HelpTip(
                `start`,
                oneline`Starts listening to the chat of the selected streamer, 
                for messages tagged with the designated language tag that are posted by users on the designated users list.`
            ),
        ],
        `Starts listening to the designated stream.`
    );
}

module.exports.StartCommand = command;