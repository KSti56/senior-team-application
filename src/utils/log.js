/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Logs a message to the console and to a file
 * @module utils/log
 */
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const logsDirectory = path.join(__dirname, '../logs')

const prefixes = {
    info: chalk.hex('#57ff6b').bold('[INFO]'),
    error: chalk.hex('#ff5e5e').bold('[ERROR]')
}

/**
 * Logs a message to the console and to a file
 * @param {string} message The message to log
 * @param {string} type The type of log to use
 */
module.exports = (message, type = 'info') => {
    const prefix = prefixes[type] || prefixes.info

    const consoleMessage = [prefix, message].join(' ')
    console.log(consoleMessage)

    const fileMessage = [new Date().toISOString(), prefix, message].join(' ')
    if (!fs.existsSync(logsDirectory)) fs.mkdirSync(logsDirectory)

    // MM-DD-YYYY-[type].log
    const logFileName = `${new Date().toLocaleDateString().replace(/\//g, '-')}-${type}.log`

    fs.appendFileSync(path.join(logsDirectory, logFileName), fileMessage + '\n')
}
