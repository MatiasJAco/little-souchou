const { AppConfig } = require("../../../app.config");
const { FlushCommand } = require("./flush.command");

const { Command, HelpTip } = require('../../models/command');
const { Timestamp } = require("../../models/timestamp");
const { LiteralConstants } = require('../../utils/literal.constants');
const { Logger } = require('../../utils/logger');
const oneline = require('oneline');
const TwitchApi = require('../../adapters/twitch/twitch-api');
const { ChatListener }  = require("../../adapters/twitch/twitch-chatlistener");

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
const { StopCommand } = require("./stop.command");

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
            const configKey = override ? override : message;
            console.log("Esta listening:",appConfig.CONFIG_STORAGE.getProperty(configKey, 'listening'));
            appConfig.CONFIG_STORAGE.setProperty(configKey, 'stream_live', false);
            if (appConfig.CONFIG_STORAGE.getProperty(configKey, 'listening') !== "true"){
            let targetChannels = [];
            // const configKey = override ? override : message;
            // const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
             const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
           //  let syncServerList = (logMembership) => {
            //    targetChannels = DiscordChannelSync.getChannelList(guild, config.discord_announce_channel, logMembership);
           // };

 
            targetChannels = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)];
            const channel = appConfig.DISCORD_HELPERS.getChannel(guild, targetChannels.find(c => c[0] == "en")[1]);
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
            StreamActivity.init(guild);
       
           TwitchMonitor.start(guild,configKey,appConfig);
           //console.log("configKey",configKey);
           
           let liveMessageDb = new MiniDb('live-messages-'+ channel.guild.id);
           let messageHistory = liveMessageDb.get("history") || { };
 

// // ---------------------------------------------------------------------------------------------------------------------
// // Live events



TwitchMonitor.onChannelLiveUpdate((streamData) => {
    const isLive = streamData.type === "live";
    let anySent = false;
    console.log("[TwitchMonitor] stream data TIPO:", streamData.type);
    console.log("[TwitchMonitor] guild:", channel.guildId);
    console.log("[TwitchMonitor] guild:", channel.guildId);
    const streamer = appConfig.CONFIG_STORAGE.getProperty(configKey, 'streamer');
    console.log("Streamdata",streamData.user_name,"streamer",streamer);
    if (streamer === streamData.user_name ){
    messageHistory = liveMessageDb.get("history") || { };
    // Refresh channel list
    // try {
    //     syncServerList(false);
    // } catch (e) { }

    // Update activity
    StreamActivity.setChannelOnline(streamData);
    //Obtain VOD's url

    const channelIds = [];
    var channelId = streamData.user_id;
    channelIds.push(channelId);
    // config.twitch_channelsids.split(',').forEach((channelId) => {
    //     if (channelId) {
    //         channelIds.push(channelId);
    //     }
    // });
    var VODurl ="";
    //console.log('VOD:', channelIds.length );
    VODurl = TwitchApi.fetchVOD(channelIds)
    .then((channels) => {
        console.log('VOD:', channels[0].url );
        VODurl=channels[0].url;
      
      //  this.handleStreamList(channels);
    
    
    
    //const configKey = "kson";

    const listener = new ChatListener(streamData.user_login, streamData,streamData.type,VODurl,false);

    console.log(channel.guildId,' - Status del listener:', listener.getLiveStatus() );
    console.log(channel.guildId,' - Nombre del listener:', listener.getName() );
    console.log(channel.guildId,' - VOD del listener:', listener.getVODurl() );
    AppConfig.LISTENER_STORAGE.setListener(configKey, listener);
    
    //AppConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', "true");
}).catch((err) => {
    console.warn('[TwitchMonitor]', 'Error in VOD query:', err);
});
    // Generate message
    const msgFormatted = `${streamData.user_name} went live on Twitch!`;
    console.log(channel.guildId,'Stream data:',streamData.started_at,streamData.game_name );
    const msgEmbed = LiveEmbed.createForStream(streamData);
    console.log(channel.guildId,"targetChannels tamanio:",targetChannels.length );
    // Broadcast to all target channels
   

    for (let i = 0; i < targetChannels.length; i++) {
        //const discordChannel = targetChannels[i];
        
        discordChannel = channel;
        console.log(channel.guildId,"discordchannel name:",discordChannel.name );
        console.log(channel.guildId,"discordchannel id:",discordChannel.guild.id );
        const liveMsgDiscrim = `${discordChannel.guild.id}_${discordChannel.name}_${streamData.id}`;
        console.log(channel.guildId,'liveMsgDiscrim',liveMsgDiscrim);
        console.log(channel.guildId,'messageHistory',messageHistory);
     //   const streamer = appConfig.CONFIG_STORAGE.getProperty(configKey, 'streamer');
        console.log("Streamdata",streamData.user_name,"streamer",streamer);
        //&& streamer === streamData.user_name
        if (discordChannel ) {
            try {
                // Either send a new message, or update an old one
                let existingMsgId = messageHistory[liveMsgDiscrim] || null;

				//let existingMsgId = false;
                if (existingMsgId) {
                    
                   
                    //flush
                   // FlushCommand(AppConfig).callback(message, args, override);
                    // Fetch existing message
                  //discordChannel.messages.fetch(existingMsgId)
                  channel.messages.fetch(existingMsgId)
                    .then((existingMsg) => {
                          // Clean up entry if no longer live
                          if (!isLive) {
                            console.log(channel.guildId,'Antes del flush',channel.guild.id  );

                            //---------------DOING something UGLY-----------///
                         /*    const configKey = channel;
                            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
                            const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
                            const timestamps = appConfig.TIMESTAMP_STORAGE.getAllTimestamps(guild);
                            logger.log(`The guild is ${guild.id} `);
                            console.log(guild.id," - tiene que revisar los timestamps:",timestamps);
                            logger.log(`Generating stream-end summary...`);
                            if(timestamps && timestamps.length > 0){
                                // get all language channels
                                const channels = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)];
                                for(entry of timestamps){
                                    // if timestamp log has content
                                    if(entry.length > 1){
                                        const language = entry[0];
                                        const summary = [];
                                        // find corresponding output channel
                                        const mychannel = appConfig.DISCORD_HELPERS.getChannel(guild, channels.find(c => c[0] == language)[1]);
                                        for(timestamp of entry[1]){
                                            console.log(guild.id," timestamp of entry :",timestamp);
                                            // check each stored timestamp for upvotes
                                            if(timestamp.length > 1){
                                                const timestampId = timestamp[0];
                                                try{
                                                    const timestampMessage =  mychannel.messages.fetch(timestampId);
                                                    if(timestampMessage){
                                                        console.log(guild.id,"Dentro de timestamp message :",timestamp);
                                                        console.log(guild.id,"Timestampmessage es:",timestampMessage);
                                                        console.log(guild.id,"reactions es:",timestampMessage.reactions.cache);
                                                        const upvotes =  timestampMessage.reactions.cache.get(LiteralConstants.REACT_UPVOTE_EMOJI);
                                                        console.log(guild.id,"upvotes es:",upvotes);
                                                        
                                                        const upvoteCount = upvotes ? upvotes.count : 0;
                                                        const downvotes = timestampMessage.reactions.cache.get(LiteralConstants.REACT_DOWNVOTE_EMOJI);
                                                        const downvoteCount = downvotes ? downvotes.count : 0;
                                                        if(upvoteCount >= downvoteCount){
                                                            console.log(guild.id,"Dentro de up and down  :",timestamp);
                                                            // write to summary log if upvoted
                                                            const timestampEntry = `${formatTime(
                                                                timestamp[1].stampTime + 
                                                                timestamp[1].adjustment - 
                                                                timestamp[1].startTime).print()} - ${timestamp[1].description}${formatTime(
                                                                    timestamp[1].stampTime + 
                                                                    timestamp[1].adjustment - 
                                                                    timestamp[1].startTime).printTwitch()}`
                                                            summary.push(timestampEntry);
                                                             console.log(`Tiemstamp ${guild.id} - ${language} - ${JSON.stringify(timestamp)}`);
                                                        }
                                                        // disables the buttons
                                                         timestampMessage.edit({
                                                            components: timestampMessage.components.map((a) => {
                                                                    a.components.map((b) => {
                                                                    b.setDisabled(true);
                                                                    return b;
                                                                })
                                                                return a;
                                                            })
                                                        })
                                                    }
                                                }catch(e){
                                                    logger.error(`Unable to find message with ID: ${timestampId}: ${e}`);
                                                }
                                            }
                                        }
                                        if(summary.length > 0){
                                            const content = summary.sort().join('\n');
                                            logger.log(`Posting ${language} summary:\n${content}`);
                                            const attachment = appConfig.DISCORD_HELPERS.generateAttachment(content, `${language}-summary.txt`);
                                            mychannel.send({ content: `The stream has ended. Here's a summary:`, files: [ attachment ]});
                                        }
                                        if(summary.length == 0){
                                          //  const content = summary.sort().join('\n');
                                         //   logger.log(`Posting ${language} summary:\n${content}`);
                                          //  const attachment = appConfig.DISCORD_HELPERS.generateAttachment(content, `${language}-summary.txt`);
                                            mychannel.send({ content: `The stream has ended. There are no tags.`});
                                        }
                                    }
                                }
                                // flush
                                appConfig.TIMESTAMP_STORAGE.deleteGuildTimestamps(guild);
                            } */

                            ////////////////////////////////////////////////////
                     
                           // FlushCommand(AppConfig).callback(channel, "", false);
                            console.log(channel.guildId,"Borrando registro:",liveMsgDiscrim);
                            delete messageHistory[liveMsgDiscrim];
                            liveMessageDb.put('history', messageHistory);
                            StopCommand(AppConfig).callback(message, "autostop", false);
                          }
                   //     });
                      })
                      .catch((e) => {
                        // Unable to retrieve message object for editing
                        if (e.message === "Unknown Message") {
                            // Specific error: the message does not exist, most likely deleted.
                            console.log(channel,"Borrando mensaje",liveMsgDiscrim);
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
/* 
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
                    } */


                    const alertRole = appConfig.DISCORD_HELPERS.getRole(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'role').alert);
                    mentionMode = `${alertRole}`;
                    let msgToSend = msgFormatted;

                    if (mentionMode) {
                        msgToSend = msgFormatted + ` ${mentionMode}`
                    }

                    let msgOptions = {
                        embed: msgEmbed
                    };

  //                  const embed2 = new MessageEmbed()
  //.setTitle(`Testing`)
  //.setDescription(`This is the description`)
  //.setTimestamp();

                    //discordChannel.send(msgToSend, msgOptions)

                    channel.send({content: msgToSend,  embeds: [msgEmbed]})
                        .then((message) => {
                            console.log('[Discord]', `Sent announce msg to #${channel.name} on ${channel.guild.name}`)

                            messageHistory[liveMsgDiscrim] = message.id;
                            liveMessageDb.put('history', messageHistory);
                           
                            if(channel.guild && channel.guild.me){
                                      channel.guild.me.setNickname(LiteralConstants.BOT_NAME_ONLINE);
                                     }
                        })
                        .catch((err) => {
                            console.log('[Discord]', `Could not send announce msg to #${channel.name} on ${channel.guild.name}:`, err.message);
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

}});

 TwitchMonitor.onChannelOffline((streamData) => {
     // Update activity
     StreamActivity.setChannelOffline(streamData);
 });









}}, 
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
             if(streamInfo.type == "live"){
            
          /*  this.discordClient.me.setActivity(streamInfo.user_name, {
                 "url": `https://twitch.tv/${streamInfo.user_name.toLowerCase()}`,
                 "type": "STREAMING"
             });*/
            // this.discordClient.me.setNickname(LiteralConstants.BOT_NAME_ONLINE);
             console.log("cliente",this.discordClient.guildid);
             console.log('[StreamActivity]', `Update current activity: watching ${streamInfo.user_name}.`);
            }else{
                console.log("cliente",this.discordClient.guildid);
                console.log('[StreamActivity]', `Update current activity: tipo ${streamInfo.type}.`);
             console.log('[StreamActivity]', 'Cleared current activity.');
             this.discordClient.me.setNickname(LiteralConstants.BOT_NAME_OFFLINE);
            }
         } else {
            console.log("cliente",this.discordClient.guildid);
             console.log('[StreamActivity]', 'Cleared current activity.');
             this.discordClient.me.setNickname(LiteralConstants.BOT_NAME_OFFLINE);
             //this.discordClient.user.setActivity(null);
 
         }
     }

     static init(discordClient) {
         this.discordClient = discordClient;
         console.log("cliente",this.discordClient.guildid);
         console.log("cliente member",this.discordClient.me);
         this.onlineChannels = { };

         this.updateActivity();

         // Continue to update current stream activity every 5 minutes or so
         // We need to do this b/c Discord sometimes refuses to update for some reason
         // ...maybe this will help, hopefully
         setInterval(this.updateActivity.bind(this), 5 * 60 * 1000);
     }
 }




module.exports.StartCommand = command;