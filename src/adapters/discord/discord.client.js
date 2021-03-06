const Discord = require('discord.js');
const { ErrorCallback, EventCallback } = require('../../engine/events');

/**
 * Creates a Discord client.
 * @param {ErrorCallback} onError Callback to execute on error.
 * @param {Map<String, EventCallback} events List of other events to listen for.
 * @param {console} logger Logging implementation.
 * @returns {DiscordClient}
 */
async function startClient(onError, events, logger){
    const client = new Discord.Client({ intents: new Discord.Intents([
        Discord.Intents.FLAGS.GUILDS, 
        Discord.Intents.FLAGS.GUILD_MESSAGES, 
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ])});
    for(let [event, callback] of events){
        client.on(event, (input) => {
            callback(client, input, onError);
        });
    }
    
    logger.log(`Client instantiated, awaiting login...`);
    return new DiscordClient(client, logger);
}

/**
 * A client for a Discord bot.
 */
class DiscordClient{
    /**
     * 
     * @param {Discord.Client} client 
     * @param {console} logger 
     */
    constructor(client, logger){
        this.client = client;
        this.logger = logger;
    }
    /**
     * Logs in to the bot account.
     * @param {string} token The login token.
     */
    login(token){
        if(this.client){
            this.client.login(token);
        }
    }
    
    /**
     * Logs out and shuts down the bot.
     */
    shutdown(){
        if(this.client){
            this.logger.log(`Client shutting down...`)
            this.client.destroy();
        }
    }
    
    /**
     * Spoofs a message to intercept.
     * 
     * Mostly useful for testing.
     * @param {string} event The event name to emit.
     * @param {any} input The event payload.
     */
    emit(event, input){
        if(this.client){
            this.client.emit(event, input)
        }
    }
}

module.exports.startClient = startClient;
module.exports.DiscordClient = DiscordClient;