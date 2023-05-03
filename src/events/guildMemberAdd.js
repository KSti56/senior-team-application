/**
 * @author ThisLightMan <light@corebot.dev>
 * @file guildMemberAdd Event
 * @module events/guildMemberAdd
 */

const client = require('../')
const debug = require('debug')('event')
const config = require('../config')

const configureMessage = require('../utils/configureMessage')

/**
 * @event guildMemberAdd
 * @param {GuildMember} member The member that joined
 */
module.exports = member => {
    debug(`guildMemberAdd (${member.user.tag})`)

    if (config.Join.Message.Enabled) {
        const joinMessage = configureMessage(config.Join.Message.Content, member)

        const channels = config.Join.Message.Channels.map(channel =>
            client.channels.cache.find(c => c.name.toLowerCase() === channel.toLowerCase())
        ).filter(channel => channel)

        channels.forEach(channel => {
            channel.send(joinMessage)
        })
    }
}
