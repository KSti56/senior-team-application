/**
 * @file Command Class
 * @author ThisLightMan <light@corebot.dev>
 */

const config = require('../config')
const Option = require('./discord/Option')
const debug = require('debug')('command')
const getCaseInsensitiveProperty = require('../utils/getCaseInsensitiveProperty')

const SlashCommand = require('./discord/SlashCommand')

module.exports = class Command {
    /**
     * @constructor Command
     * @param {object} param0 Command Options
     * @param {string} param0.name The name of the command.
     * @param {string} param0.description The description of the command.
     * @param {function} param0.exec The execution function of the command.
     * @param {object} param0.options The options of the command.
     */
    constructor ({
        name = null,
        description = 'No description provided.',
        exec = () => {},
        options = []
    } = {
        name: null,
        description: 'No description provided.',
        usage: 'No usage provided.',
        exec: () => {},
        data: []
    }) {
        this.name = name
        this.description = description
        this.exec = exec
        this.options = options || []
    }

    /**
     * @method setName Set the name of the command
     * @param {string} name The new command name
     */
    setName (name) {
        this.name = name

        return this
    }

    /**
     * @method setDescription Set the description of the command
     * @param {string} description The new command description
     */
    setDescription (description) {
        this.description = description

        return this
    }

    /**
     * @method setExec Set the execution function of the command
     */
    setExec (exec) {
        this.exec = exec

        return this
    }

    /**
     * @method importSettings Import settings from the config file
     * @param {string} name The name of the command to import
     */
    importSettings (name) {
        const options = getCaseInsensitiveProperty(config.Commands, name)

        if (options) {
            const { Name, Description } = options

            if (Name) this.setName(Name)
            if (Description) this.setDescription(Description)

            debug('Imported settings for command %s', Name)
        }

        return this
    }

    /**
     * @method addOption Add an option to the command
     * @param {Option} option The option to add
     */
    addOption (option) {
        this.options.push(option)

        return this
    }

    /**
     * @method getDiscordData Get the data of the command formatted for the Discord API
     * @returns {object} The formatted data
     */
    getDiscordData () {
        return new SlashCommand({ name: this.name, description: this.description, options: this.options }).formatData()
    }
}
