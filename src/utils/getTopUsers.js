/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Gets the top x users in a server based on their number of messages in the past y time
 * @module utils/getTopUsers
 */

const db = require('better-sqlite3')('main.db')
const parse = require('parse-duration')

/**
 * Gets the top x users in a server based on their number of messages in the past y time
 * @param {string} serverId The Discord server ID
 * @param {number} time The time to get the stats for
 * @returns {object[]} The top x users in a server based on their number of messages in the past y time
 */
module.exports = (serverId, time = '1h') => {
    const ms = parse(time)

    const rows = db.prepare('SELECT * FROM message_stats WHERE timestamp > ? AND serverId=?').all(Date.now() - ms, serverId)

    const users = {}

    for (const row of rows) {
        if (!users[row.userId]) users[row.userId] = 0
        users[row.userId]++
    }

    const sorted = Object.entries(users).sort((a, b) => b[1] - a[1])

    return sorted
}
