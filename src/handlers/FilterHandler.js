const config = require('../config')
const configureMessage = require('../utils/configureMessage')

const infractions = []
const parseDuration = require('parse-duration')
const filterCooldownMs = parseDuration(config.AutoMod.Filter.Cooldown)

const db = require('better-sqlite3')('main.db')

module.exports = message => {
    const bypassRoles = config.AutoMod.BypassRoles
        .map(role => message.guild.roles.cache.find(r => r.name.toLowerCase() === role.toLowerCase()))
        .filter(role => role)
        .map(role => role.id)

    const hasBypass = message.member.roles.cache.some(role => bypassRoles.includes(role.id))
    if (hasBypass) return

    const filterList = config.AutoMod.Filter.List
    const filterActions = config.AutoMod.Filter.Actions

    const filteredWord = filterList.find(f => message.content.toLowerCase().includes(f.toLowerCase()))
    if (!filteredWord) return

    message.delete()

    const timestamp = Date.now()

    infractions.push({
        serverId: message.guild.id,
        userId: message.author.id,
        timestamp
    })

    setTimeout(() => {
        const index = infractions.findIndex(i => i.timestamp === timestamp)
        if (index !== -1) infractions.splice(index, 1)
    }, filterCooldownMs)

    const infractionsForUser = infractions.filter(i => i.serverId && message.guild.id && i.userId === message.author.id)
    const action = filterActions[infractionsForUser.length]

    if (action) {
        // Tempmute the user
        const duration = parseDuration(action.Tempmute)
        const endsAt = Date.now() + duration

        db.prepare('INSERT INTO mutes (serverId, userId, endsAt) VALUES (?, ?, ?)').run(message.guild.id, message.author.id, endsAt)

        const muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === config.AutoMod.MuteRole.toLowerCase())
        if (muteRole) {
            message.member.roles.add(muteRole)
        }

        message.channel.send(configureMessage(config.Messages.Tempmute, message.member, [
            {
                name: 'duration',
                value: action.Tempmute
            },
            {
                name: 'infractions',
                value: infractionsForUser.length
            }
        ]))
    } else {
        message.channel.send(configureMessage(config.Messages.Filter, message.member, [
            {
                name: 'infractions',
                value: infractionsForUser.length
            }
        ]))
    }
}
