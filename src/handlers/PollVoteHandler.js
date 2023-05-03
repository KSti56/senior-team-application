/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Poll Vote Handler
 * @module handlers/PollVoteHandler
 */

const db = require('better-sqlite3')('main.db')

/**
 * Updates the poll results
 * @param {Message} message The poll message
 */
const updatePollResults = message => {
    const poll = db.prepare('SELECT * FROM polls WHERE pollId = ?').get(message.id)
    const pollOptions = db.prepare('SELECT * FROM poll_options WHERE pollId = ?').all(message.id)
    const votes = db.prepare('SELECT * FROM poll_votes WHERE pollId = ?').all(message.id)

    const embed = message.embeds[0]

    let description = `${poll.description}\n\n`

    pollOptions.forEach((option, index) => {
        const optionVotes = votes.filter(vote => vote.optionId === index)
        description += `${option.emoji} **${option.name}** (${optionVotes.length})\n`
    })

    embed.data.description = description

    message.edit({ embeds: [embed] })
}

/**
 * @event interactionCreate
 * @param {ButtonInteraction} interaction The button interaction
 * @returns {<void>}
 */
module.exports = interaction => {
    const pollId = interaction.message.id
    const optionId = +interaction.customId.replace('vote-', '')

    const hasVoted = db.prepare('SELECT * FROM poll_votes WHERE pollId = ? AND userId = ?').get(pollId, interaction.user.id)

    if (hasVoted && hasVoted.optionId === optionId) {
        db.prepare('DELETE FROM poll_votes WHERE pollId = ? AND userId = ?').run(pollId, interaction.user.id)

        interaction.deferUpdate()
        return updatePollResults(interaction.message)
    }

    if (hasVoted) {
        interaction.reply({ content: 'You have already voted for this poll.', ephemeral: true })
        return
    }

    db.prepare('INSERT INTO poll_votes (pollId, userId, optionId) VALUES(?, ?, ?)').run(pollId, interaction.member.id, optionId)

    interaction.deferUpdate()
    return updatePollResults(interaction.message)
}
