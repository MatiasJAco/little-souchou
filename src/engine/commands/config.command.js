const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const oneline = require('oneline');
const { Logger } = require('../../utils/logger');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['config', 'conf', 'c'],
        2,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            logger.log("args:", `${args.join(' ')}`);
            logger.log("Configkey:", `${configKey}`);

            const fields = appConfig.CONFIG_STORAGE.getAllProperties(configKey).map(prop => {
                return {
                    name: `${prop[0]}:`,
                    value: `\`${JSON.stringify(prop[1], undefined, 2)}\``,
                }
            });
            await message.channel.send({
                embeds: [
                    appConfig.DISCORD_HELPERS.generateEmbed({
                        message: `Here is the current configuration of this server:`,
                        fields: fields,
                    })
                ],
            });
        },      
        [
            new HelpTip(
                `config`,
                oneline`Displays a list of all configurable properties for the server.`
            ),
        ],
        `Displays configruable properties.`
    );
}

module.exports.ConfigCommand = command;