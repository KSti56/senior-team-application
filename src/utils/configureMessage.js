/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Configure custom message
 * @module utils/configureMessage
 */

const getCaseInsensitiveProperty = require('./getCaseInsensitiveProperty')
const replaceUserPlaceholders = require('./replaceUserPlaceholders')
const replacePlaceholders = require('./replacePlaceholders')
const buildButton = require('./buildButton')

const { EmbedBuilder, ActionRowBuilder } = require('discord.js')

/**
 * Get and process a property from a message configuration object, case-insensitively
 * @param {object} object The message config object
 * @param {string} property The property to get
 * @param {GuildMember} member The member to get the values from
 * @param {object[]=} additionalPlaceholders Additional placeholders to replace
 * @returns {string} The property value
 */
const getValue = (object, property, member, additionalPlaceholders) => {
    const value = getCaseInsensitiveProperty(object, property)
    if (!value) return undefined

    const replacedUserPlaceholders = replaceUserPlaceholders(value, member)
    const replacedPlaceholders = replacePlaceholders(replacedUserPlaceholders, additionalPlaceholders || [])

    return replacedPlaceholders
}

/**
 * Configure a custom message
 * @param {object} messageConfig The message configuration object
 * @param {GuildMember} member The member to get the values from
 * @param {object[]=} additionalPlaceholders Additional placeholders to replace
 * @returns {object} The message content and embeds
 */
module.exports = (messageConfig, member, additionalPlaceholders) => {
    const text = getValue(messageConfig, 'text', member, additionalPlaceholders)

    const title = getValue(messageConfig, 'title', member, additionalPlaceholders)
    const description = getValue(messageConfig, 'description', member, additionalPlaceholders)
    const color = getValue(messageConfig, 'color', member, additionalPlaceholders) || '#1167b8'
    const thumbnail = getValue(messageConfig, 'thumbnail', member, additionalPlaceholders)
    const image = getValue(messageConfig, 'image', member, additionalPlaceholders)
    const footerText = getValue(messageConfig, 'footer', member, additionalPlaceholders)
    const footerIcon = getValue(messageConfig, 'footerIcon', member, additionalPlaceholders)
    const timestamp = getValue(messageConfig, 'timestamp', member, additionalPlaceholders)
    const authorText = getValue(messageConfig, 'author', member, additionalPlaceholders)
    const authorIcon = getValue(messageConfig, 'authorIcon', member, additionalPlaceholders)
    const authorUrl = getValue(messageConfig, 'authorUrl', member, additionalPlaceholders)
    const url = getValue(messageConfig, 'url', member, additionalPlaceholders)

    const fields = getCaseInsensitiveProperty(messageConfig, 'fields') || []
    const formattedFields = []
    if (fields) {
        fields.forEach(field => {
            formattedFields.push({
                name: getValue(field, 'name', member, additionalPlaceholders) || '\u200b',
                value: getValue(field, 'value', member, additionalPlaceholders) || '\u200b',
                inline: getValue(field, 'inline', member, additionalPlaceholders) || false
            })
        })
    }

    const embed = new EmbedBuilder()

    if (authorText) embed.setAuthor({ name: authorText, iconURL: authorIcon, url: authorUrl })
    if (color) embed.setColor(color)
    if (description) embed.setDescription(description)
    if (footerText) embed.setFooter({ text: footerText, iconURL: footerIcon })
    if (image) embed.setImage(image)
    if (thumbnail) embed.setThumbnail(thumbnail)
    if (title) embed.setTitle(title)
    if (timestamp) embed.setTimestamp(timestamp)
    if (url) embed.setURL(url)
    if (formattedFields) embed.addFields(formattedFields)

    const components = getCaseInsensitiveProperty(messageConfig, 'components') || []
    const formattedComponents = []
    if (components && Array.isArray(components)) {
        components.forEach(row => {
            const actionRow = new ActionRowBuilder()

            row.forEach(component => {
                if (getCaseInsensitiveProperty(component, 'type') === 'button') {
                    const button = buildButton(component)
                    actionRow.addComponents(button)
                }
            })

            formattedComponents.push(actionRow)
        })
    }

    return {
        content: text,
        embeds: [embed],
        components: formattedComponents
    }
}
