/**
 * @author ThisLightMan <light@corebot.dev>
 */

const Discord = require('discord.js')
const { Client, Partials, GatewayIntentBits } = Discord

const log = require('./utils/log')
const debug = require('debug')('startup')

debug('Loading better-sqlite3')

const db = require('better-sqlite3')('main.db')
db.prepare('CREATE TABLE IF NOT EXISTS message_stats (serverId, userId, timestamp)').run()
db.prepare('CREATE TABLE IF NOT EXISTS mutes (serverId, userId, endsAt)').run()

debug('Loaded better-sqlite3')

const EventHandler = require('./handlers/EventHandler')
const CommandHandler = require('./handlers/CommandHandler')
const TempMuteHandler = require('./handlers/TempMuteHandler')

const client = new Client({
    autoReconnect: true,
    partials: [Partials.Channel],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution
    ]
})

debug('Loading console-stamp')

// Console Stamp Setup
require('console-stamp')(console)

debug('Logging into Discord')
const config = require('./config')

client.login(config.Token)
    .then(() => {
        module.exports.client = client

        debug('Logged into Discord')
        log(`Logged into Discord (${client.user.tag})`, 'info')

        debug('Running EventHandler#register')
        EventHandler.register()
        debug('Finished running EventHandler#register')

        debug('Running CommandHandler#register')
        CommandHandler.register()
        debug('Finished running CommandHandler#register')

        TempMuteHandler()
    })
    .catch((err) => {
        if (err.toString().includes('TokenInvalid')) {
            debug('Failed to log into Discord: %O', err)
            log('Failed to log into Discord. Make sure your token is valid.', 'error')

            process.exit(1)
        } else {
            log(err, 'error')
            throw err
        }
    })
