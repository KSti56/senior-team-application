/**
 * @author ThisLightMan <light@corebot.dev>
 * @file messageCreate Event
 * @module events/messageCreate
 */

const db = require('better-sqlite3')('main.db')
const FilterHandler = require('../handlers/FilterHandler')

module.exports = message => {
    if (message.author.bot) return
    if (message.channel.type === 'DM') return

    db.prepare('INSERT INTO message_stats (serverId, userId, timestamp) VALUES(?, ?, ?)').run(message.guild.id, message.author.id, Date.now())

    FilterHandler(message)
}
