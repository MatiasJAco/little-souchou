const { formatTime } = require('../utils/time.utils');
class Timestamp{
    /**
     * Class for represeting a timestamp in a stream.
     * @param {Number} startTime The timestamp of stream start.
     * @param {Number} stampTime The timestamp of the moment.
     * @param {Number} adjustment The amount of time backward to offset the timestamp.
     * @param {Number} authorId The member ID of the author of the stamp.
     * @param {String} dscription The description of the timestamp.
     * @param {String} VODurl The url of the VOD of the stream.
     * 
     */
    constructor(startTime, stampTime, adjustment, authorId, description,VODurl){
        this.startTime = startTime;
        this.stampTime = stampTime;
        this.adjustment = adjustment;
        this.authorId = authorId;
        this.description = description;
        this.VODurl = VODurl;
        this.description = `${this.description} ${this.VODurl}?t=`
    }
}

module.exports.Timestamp = Timestamp;