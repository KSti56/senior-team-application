/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Ready Event
 * @module events/ready
 */

const log = require('../utils/log')
const index = require('../')
const debug = require('debug')('event')

/**
 * @event ready
 */
module.exports = () => {
    log(`Your Discord Bot is now ready (${index.client.user.tag})`)
    debug('ready')
}
