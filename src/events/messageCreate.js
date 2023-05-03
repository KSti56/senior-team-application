/**
 * @author ThisLightMan <light@corebot.dev>
 * @file messageCreate Event
 * @module events/messageCreate
 */

const client = require('../')
const debug = require('debug')('event')
const config = require('../config')

const db = require('better-sqlite3')('main.db')

module.exports = message => {
    if (message.author.bot) return
    if (message.channel.type === 'DM') return

    db.prepare('INSERT INTO message_stats (serverId, userId, timestamp) VALUES(?, ?, ?)').run(message.guild.id, message.author.id, Date.now())
}
