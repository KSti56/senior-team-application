/**
 * @file Config File Loader
 * @author ThisLightMan <light@corebot.dev>
 */

const path = require('path')
const yaml = require('yaml')
const fs = require('fs')
const debug = require('debug')('config')

const configPath = path.join(__dirname, '../config.yml')
const configContent = fs.readFileSync(configPath, 'utf-8')
const config = yaml.parse(configContent, 'utf-8')

debug('Loaded config from %s', configPath)

module.exports = config
