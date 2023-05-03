/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Replaces placeholders in a string with information about a user.
 * @module utils/replaceUserPlaceholders
 */

const replacePlaceholders = require('./replacePlaceholders')

/**
 * Replace placeholders in a string with information about a user.
 * @param {string} string The string to replace placeholders in.
 * @param {GuildMember} member The member to replace placeholders with.
 * @param {string=} prefix The prefix to use for placeholders.
 * @returns {string} The string with placeholders replaced.
 */
module.exports = (string, member, prefix = 'user') => {
    return member
        ? replacePlaceholders(string, [
            [`${prefix}-id`, member.id],
            [`${prefix}-tag`, member.user.tag],
            [`${prefix}-username`, member.user.username],
            [`${prefix}-discriminator`, member.user.discriminator],
            [`${prefix}-mention`, member.toString()],
            [`${prefix}-avatar`, member.user.displayAvatarURL({ dynamic: true })],
            [`${prefix}-createdAt`, member.user.createdAt.toLocaleString()],
            [`${prefix}-joinedAt`, member.joinedAt.toLocaleString()],
            [`${prefix}-joinedTimestamp`, member.joinedTimestamp],
            [`${prefix}-createdAtTimestamp`, member.user.createdTimestamp],
            [`${prefix}-nickname`, member.nickname || member.user.username],
            [`${prefix}-roles`, member.roles.cache.map(role => role.name).join(', ')],
            [`${prefix}-highestRole`, member.roles.highest.name],
            [`${prefix}-highestRoleColor`, member.roles.highest.hexColor],
            [`${prefix}-highestRoleID`, member.roles.highest.id],
            [`${prefix}-highestRolePosition`, member.roles.highest.position],
            [`${prefix}-color`, member.displayHexColor]
        ])
        : string
}
