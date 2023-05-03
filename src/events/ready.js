/**
 * @file Ready Event
 * @author ThisLightMan <light@corebot.dev>
 */

const log = require('../utils/log')
const index = require('../')
const debug = require('debug')('event')

module.exports = () => {
    log(`Your Discord Bot is now ready (${index.client.user.tag})`)
    debug('ready')
}
