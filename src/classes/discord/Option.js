/**
 * @file Option Class
 * @author ThisLightMan
 */

const { ApplicationCommandOptionType } = require('discord.js')
const getCaseInsensitiveProperty = require('../../utils/getCaseInsensitiveProperty')

/**
 * @class Option
 */
module.exports = class Option {
    /**
     * @constructor Option Class
     * @param {object} param0 Option data
     * @param {string} param0.name The name of the option.
     * @param {string=} param0.description The description of the option.
     * @param {ApplicationCommandOptionType=} param0.type The option type.
     * @param {boolean=} param0.required Whether or not the option is required.
     * @param {Option[]=} param0.options The sub-options of the option.
     */
    constructor ({
        name = null,
        description = 'No description provided.',
        type = ApplicationCommandOptionType.String,
        required = false,
        options = []
    }) {
        this.name = name
        this.description = description
        this.type = type
        this.required = required
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
            options: this.options
        }
    }
}
