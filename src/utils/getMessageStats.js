/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Gets the number of messages sent in a time period
 * @module utils/getMessageStats
 */

const db = require('better-sqlite3')('main.db')
const parse = require('parse-duration')

/**
 * Gets the number of messages sent in a time period
 * @param {string} serverId The Discord server ID
 * @param {number} time The time to get the stats for
 * @returns {number} The number of messages sent in the time period
 */
module.exports = (serverId, time = '1h') => {
    const ms = parse(time)

    const rows = db.prepare('SELECT * FROM message_stats WHERE timestamp > ? AND serverId=?').all(Date.now() - ms, serverId)

    return rows.length
}
