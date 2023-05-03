/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Build a button
 * @module utils/buildButton
 */

const { ButtonBuilder, ButtonStyle } = require('discord.js')
const getCaseInsensitiveProperty = require('./getCaseInsensitiveProperty')

/**
 * Build a button
 * @param {object} buttonConfig The button configuration
 * @returns {ButtonBuilder} The built button
 */
module.exports = (buttonConfig) => {
    const button = new ButtonBuilder()

    const styleName = getCaseInsensitiveProperty(buttonConfig, 'style')
    const style = getCaseInsensitiveProperty(ButtonStyle, styleName) || ButtonStyle.Secondary

    button.setStyle(style)

    const label = getCaseInsensitiveProperty(buttonConfig, 'label')
    const emoji = getCaseInsensitiveProperty(buttonConfig, 'emoji')
    const customId = getCaseInsensitiveProperty(buttonConfig, 'customId')
    const url = getCaseInsensitiveProperty(buttonConfig, 'url')
    const disabled = getCaseInsensitiveProperty(buttonConfig, 'disabled')

    if (label) button.setLabel(label)
    if (emoji) button.setEmoji(emoji)
    if (customId) button.setCustomId(customId)
    if (url) button.setURL(url)
    if (disabled) button.setDisabled(disabled)

    return button
}
