const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { Timestamp } = require("../../models/timestamp");
const { LiteralConstants } = require('../../utils/literal.constants');
const { Logger } = require('../../utils/logger');
const { formatTime } = require('../../utils/time.utils');
const { StreamActivity } = require('../../../index.js');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['timestamp', 'ts', 't'],
        1,
        async(message, args, override) => {
            const configKey = override ? override : message;
           
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            const listener = appConfig.LISTENER_STORAGE.getListener("kson");
            //logger.log("listening:", `${listener.isListening()}`);
            const liveStat = listener.getLiveStatus();
            const sdata = listener.getStreamData();
            const type = sdata.type;
            const VODurl=listener.getVODurl();
            logger.log(`livestat ${liveStat}`);
            logger.log(`tipo ${type}`);
            logger.log(`VODurl ${VODurl}`);
            logger.log("args:", `${args.join(' ')}`);
            //logger.log("Configkey:", `${configKey}`);
            //logger.log("listener:", `${listener}`);
            logger.log("Intentando crear timestamp");
            if(args.length > 0){
                logger.log("Entro a primera condicion");
                const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
                const languages = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)].filter(c => { 
                    return appConfig.DISCORD_HELPERS.getChannel(guild, c[1]) == message.channel
                });
               
                if(languages.length > 0){
                  //  const liveInfo = await listener.getLiveStatus();
                    if(liveStat == "live" ){
                     //   if(true ){
                        const now = Date.parse(new Date());
                       const start_time = Date.parse(sdata.started_at);
                        const timestamp = new Timestamp(start_time, now, -(10 * 1000), message.member.id, args.join(' '),VODurl);
                        //const timestamp = new Timestamp(now, now, -(10 * 1000), message.member.id, args.join(' '));
                        const embed = await message.channel.send({
                            embeds: [
                                renderTimestamp(appConfig, timestamp)
                            ],
                            components: [
                                appConfig.DISCORD_HELPERS.generateButtonRow([
                                    { label: '-5s', customId: 'timestamp_subtract', style: 2 },
                                    { label: '+5s', customId: 'timestamp_add', style: 2 },
                                ])
                            ],
                        });
                        for(let language of languages){
                            //const timestampEntry = `${timestamp.time.print()} - ${timestamp.description}`
                            logger.log(`Writing timestamp: ${timestamp}`);
                            appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, language[0], embed.id, timestamp);
                        }
                        await embed.react(LiteralConstants.REACT_UPVOTE_EMOJI);
                        await embed.react(LiteralConstants.REACT_DOWNVOTE_EMOJI);
                        return;
                    }
                    const reason =  `Stream is not currently live!`;
                    logger.log(`Cannot post timestamp because: ${reason}`);
                    message.channel.send({
                        content: reason
                    });
                    return;
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            }
            return LiteralConstants.REACT_ERROR_EMOJI;
        },
        [
            new HelpTip(
                `timestamp <text description>`,
                `Creates a timestamp at ten seconds prior to invocation, with the given description. 

                Timestamps can be manually adjusted by their creator with the correpsonding buttons.

                Timestamps can be upvoted or downvoted with the assigned reacts. 
                If the number of downvotes is greater than the number of upvotes, the timestamp will be discarded.

                A summary list of all remaining timestamps will be posted at the conclusion of the stream.`
            ),
        ],
        `Creates a note about a moment from the stream.`
    );
}
/**
 * 
 * @param {AppConfig} appConfig 
 * @param {Timestamp} timestamp 
 */
function renderTimestamp(appConfig, timestamp){
    return appConfig.DISCORD_HELPERS.generateEmbed(
        {
            message: `Timestamp:`,
            fields: [{
                name: `\`${formatTime(timestamp.stampTime - timestamp.startTime).print()} (${timestamp.adjustment/1000}s)\``,
                value: `"${timestamp.description}${formatTime(timestamp.stampTime - timestamp.startTime).printTwitch()}"`
//                value: `"${timestamp.description} https://www.twitch.tv/videos/${timestamp.streamid}?t=${formatTime(timestamp.stampTime - timestamp.startTime).printTwitch()}"`
            }]
        }
    )
}

module.exports.TimestampCommand = command;
module.exports.renderTimestamp = renderTimestamp;