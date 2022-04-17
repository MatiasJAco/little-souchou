const Discord = require('discord.js')
const client = new Discord.Client()
const TwitchAPI = require('node-twitch').default
const config = require('./config')

const twitch = new TwitchAPI({
    client_id: config.twitch.AppClientID,
    client_secret: config.twitch.AppSecretToken
})
