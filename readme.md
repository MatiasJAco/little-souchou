# little-souchou
A Discord bot for integrating with the [twitch.com](https://www.twitch.com) streaming platform.
 
## About
Named after the latest digital persona of beloved  streamer [kson] , this bot was built to help facilitate the enjoyment of her streams by her fans abroad. 
 
To that end, this bot seeks to achieve two primary goals:
1) To provide go-live alerts for a designated streamer by pinging a designated role, and posting the alert in a designated Discord channel.
2) To allow users to mark timestamps for noteworthy moments during a stream, which will be summarized in a log file at the end of the stream.
 
## Contact
 
This bot is built based on code written by Tom "Skeletom" Farro, (https://github.com/FomTarro/little-daiko). If you need to contact him, the best way to do so is via [Twitter](https://www.twitter.com/fomtarro) or by leaving an issue ticket on his repo. 
If you need to contact me about the twitch integration, feel free to leave an issue ticket on this repo.
Currently, this bot is not available for public deployment, but may become public in the near future.
 
# Usage
 
While it was built with kson in mind, it can be configured by server operators to work with any Twitch streamer's channel. 

Like most Discord bots, this one is controlled via commands.

Commands can be invoked by starting a message with a designated prefix (`!` by default), or by mentioning the bot with the desired command.
 

## Listening

To get the bot to start listening for  go-live notifications for a stream, first designate the stream to listen to with the following command:
```
!streamer ksonsouchou
```
This will have the bot listen to the Twitch channel  https://www.twitch.tv/ksonsouchou , when the bot is active. Next, let's activate the bot with the following command: 
```
!start
```
The bot should now be set to listen to the channel forever. If for some reason you wish to stop listening, simply stop it with the following command:
```
!stop
```

If the bot is currently listening a live stream, it will include `🟢` in its display name. If the stream is not live, it will instead include `🔴`. 
But bear in mind that the icon does not mean the bot is inactive. For that, execute the status command. If the command returns "stopped", it means the bot needs to be started with the start command. 

## Commands

Here is a list of every command the bot currently supports.

You can learn more about them by typing `!help <command>`.

### `config`

Command Information:

Alternate Names: `[config, conf, c]`

Usable by: Operator Role, Server Owner or Developer.

`!config`

Displays a list of all configurable properties for the server.


### `flush`

Command Information:

Alternate Names: `[flush, f]`

Usable by: Operator Role, Server Owner or Developer.

`!flush`

Flushes all timestamps to log files immediately, and posts them to their respective channels. 

Flushing happens automatically on stream end, so you will probably never need to invoke this command manually.

### `help`

Command Information:

Alternate Names: `[help, h]`

Usable by: Any user.

`!help`

Displays a list of all commands and their alternate names.

`!help <command>`

Displays usage information about a specific command.

### `output`

Command Information:

Alternate Names: `[output, out, o]`

Usable by: Operator Role, Server Owner or Developer.

`!output chat add <language prefix> <channel name or id>`

Sets the server channel which stream messages with the designated language prefix will be posted to. Stream notifications from the streamer will go to all language channels.

`!output chat remove <language prefix>`

Stops posting to the server for the given language prefix.

`!output alert <channel name or id>`

Sets the server channel which stream go-live alerts will be posted to.

### `prefix`

Command Information:

Alternate Names: `[prefix, p]`

Usable by: Operator Role, Server Owner or Developer.

`!prefix <prefix string>`

Sets the prefix to denote bot commands.

### `remote`

Command Information:

Alternate Names: `[remote, rem]`

Usable by: Developer.

`!remote <server id> <command> <command args>`

Allows remote execution of commands on deployed servers by the bot owner,  for checking on bot status and assisting with setup.

### `role`

Command Information:

Alternate Names: `[role, r]`

Usable by: Server Owner or Developer.

`!role ops <role name or id>`

Sets the role of permitted operators of the bot for this server. The server owner and the developer are granted these permissions without needing the role.

`!role alert <role name or id>`

Sets the role to ping when the designated streamer goes live.  The alert will be posted in the designated alert channel.


### `start`

Command Information:

Alternate Names: `[start, listen, l]`

Usable by: Operator Role, Server Owner or Developer.

`!start`

Starts listening to the selected streamer for activity.

### `status`

Command Information:

Alternate Names: `[status]`

Usable by: Operator Role, Server Owner or Developer.

`!status`

Lists the status of bot. If stopped, it needs to be started with the start command.

### `stop`

Command Information:

Alternate Names: `[stop, x]`

Usable by: Operator Role, Server Owner or Developer.

`!stop`

Stops listening to the chat of the selected streamer.

### `streamer`

Command Information:

Alternate Names: `[streamer, s]`

Usable by: Operator Role, Server Owner or Developer.

`!streamer <streamer channel name>`

Sets the streamer to listen to. The streamer name  must be a string, the twitch channel name.  If this is changed while the listener is currently active, please execute a flush mannually so the old timestamps get cleared.

### `timestamp`

Command Information:

Alternate Names: `[timestamp, ts, t]`

Usable by: Any user.

`!timestamp <text description>`

Creates a timestamp at ten seconds prior to invocation, with the given description and the VOD link with the timestamp in the url. 


Timestamps can be manually adjusted by their creator with the correpsonding buttons.


Timestamps can be upvoted or downvoted with the assigned reacts. 

If the number of downvotes is greater than the number of upvotes, the timestamp will be discarded.


A summary list of all remaining timestamps will be posted at the conclusion of the stream.




