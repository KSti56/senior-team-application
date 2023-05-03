/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Get trivia data from the Open Trivia Database (configured in config.yml)
 * @module utils/getTriviaData
 */

const fetch = require('node-fetch')
const triviaUrl = require('../config').Trivia.URL

module.exports = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(triviaUrl)
            const data = await response.json()
            resolve(data.results)
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}
