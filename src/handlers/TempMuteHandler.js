/**
 * @author ThisLightMan <light@corebot.dev>
 * @file TempMuteHandler.js
 * @module handlers/TempMuteHandler
 */

const db = require('better-sqlite3')('main.db')
const index = require('../')
const config = require('../config')

const debug = require('debug')('tempmutes')

/**
 * Checks for ended mutes and removes the mute role from the user if the mute has ended.
 */
const checkForEndedMutes = () => {
    debug('Checking for ended mutes')
    db.prepare('SELECT * FROM mutes WHERE endsAt < ?').all(Date.now()).forEach(mute => {
        debug(`Removing mute from ${mute.userId} in ${mute.serverId} (ended ${Date.now() - mute.endsAt} ms ago)`)
        db.prepare('DELETE FROM mutes WHERE endsAt = ?').run(mute.endsAt)

        const guild = index.client.guilds.cache.get(mute.serverId)
        const member = guild.members.cache.get(mute.userId)

        if (!member) return

        const role = guild.roles.cache.find(r => r.name.toLowerCase() === config.AutoMod.MuteRole.toLowerCase())

        if (!role) return

        member.roles.remove(role)

        debug('Removed mute from user')
    })
}

/**
 * @module handlers/TempMuteHandler
 */
module.exports = () => {
    checkForEndedMutes()

    setInterval(checkForEndedMutes, 1000 * 60)
}
