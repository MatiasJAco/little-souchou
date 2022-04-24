const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { Logger } = require('../../utils/logger');
const { StreamerCommand } = require("./streamer.command");
const { FlushCommand } = require("./flush.command");
const { LiteralConstants } = require('../../utils/literal.constants');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['stop', 'x'],
        2, 
        async (message, args, override) => { 
            const configKey = override ? override : message;
            StreamerCommand(AppConfig).callback(message, ["null"], false);
            console.log("Cambio streamer",message);
            //Obtain guild to change icon
            const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
            console.log('[StreamActivity]', 'Cleared current activity.');
            guild.me.setNickname(LiteralConstants.BOT_NAME_OFFLINE);

            //const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            await message.channel.send({content: "Stopping listener."});
            FlushCommand(AppConfig).callback(message, "", false);
            console.log("Flush de stop",message);
            
          //  appConfig.LISTENER_STORAGE.deleteListener(configKey);
           // appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', false);
            //logger.log(`Stopping listener.`);
        },
        [
            new HelpTip(
                `stop`,
                `Stops listening to the chat of the selected streamer.`
            ),
        ],
        `Stops listening to the designated stream.`
    );
}

module.exports.StopCommand = command;