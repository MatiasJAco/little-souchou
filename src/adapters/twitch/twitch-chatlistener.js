const config = require('../../../config.json');
const TwitchApi = require('./twitch-api');
const MiniDb = require('../../utils/minidb');
const moment = require('moment');

/**
 * A listener to the mildom channel of the given ID.
 */
 class ChatListener{
    /**
     * 
     * @param {string} streamer 
     * @param {any} streamData
     * @param {string} status
     * @param {string} VODurl
     * @param {console} logger 
     */
    constructor(streamer, streamData,status,VODurl,logger){
        this.streamer = streamer;
        this.status = status;
        this.VODurl = VODurl;
        this.logger = logger ? logger : console;
        this.streamData = streamData;
        // start pinging
      //  this.ping();
    }

    /**
     * Gracefully disconnects the listener and stops automatic reconnect attempts.
     */
    stopListener(){
        // if(this.pingTimer){
        //     clearTimeout(this.pingTimer);
        // }
        // if(this.webSocket){
        //     this.webSocket.close();
        // }
    }
    /**
     * Checks if the listener is actively connected to the channel.
     * @returns {Boolean}
     */
    isListening(){

        return true;
    }


    /**
     * Returns streamer name.
     * @returns {Boolean}
     */
     getName(){

        return this.streamer;
    }


    /**
     * Returns curent stream VOD url.
     * @returns {String}
     */
     getVODurl(){

        return this.VODurl;
    }

    /**
     * Fetches the live info of the stream.
     * @returns {string}
     */
    getLiveStatus(){
        return this.status;
    }

    getStreamData(){
        return this.streamData;
    }


    /**
     * Recursively pings the channel to keep the listener alive.
     */
    async ping(){
        return "";

    }
}

module.exports.ChatListener = ChatListener;
//module.exports = ChatListener;
