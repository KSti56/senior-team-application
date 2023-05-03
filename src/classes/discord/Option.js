/**
 * @file Option Class
 * @author ThisLightMan
 */

const { ApplicationCommandOptionType } = require('discord.js')
const getCaseInsensitiveProperty = require('../../utils/getCaseInsensitiveProperty')

module.exports = class Option {
    constructor ({
        name = null,
        description = 'No description provided.',
        type = ApplicationCommandOptionType.String,
        required = false,
        choices = [],
        options = []
    }) {
        this.name = name
        this.description = description
        this.type = type
        this.required = required
        this.choices = choices
        this.options = options
    }

    /**
     * @method setName Set the name of the option
     * @returns {object} The data to send to Discord
     */
    getDiscordData () {
        return {
            name: this.name,
            description: this.description,
            type: getCaseInsensitiveProperty(ApplicationCommandOptionType, this.type),
            required: this.required,
            choices: this.choices,
            options: this.options
        }
    }
}
