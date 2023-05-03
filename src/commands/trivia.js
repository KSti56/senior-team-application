/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Trivia Command
 * @module commands/trivia
 */

const { Command, Option } = require('../classes')
const configureMessage = require('../utils/configureMessage')
const config = require('../config')
const getTriviaData = require('../utils/getTriviaData')
const awaitButtonPress = require('../utils/awaitButtonPress')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const decodeHTMLEntities = require('html-entities').decode

/**
 * @class Trivia Command
 */
module.exports = new Command()
    .importSettings('trivia')
    .addOption(new Option({
        name: 'user',
        description: 'The user to challenge',
        type: 'USER',
        required: true
    }))
    .setExec(async interaction => {
        const target = interaction.options.get('user').user
        const targetMember = await interaction.guild.members.fetch(target.id)

        const triviaData = await getTriviaData()
        if (!triviaData) return interaction.reply(configureMessage(config.Messages.CouldNotFetchTrivia, interaction.member))

        const challengeMessage = configureMessage(config.Messages.TriviaChallenge, interaction.member, [
            {
                name: 'opponent-mention',
                value: target.toString()
            }
        ])

        const reply = await interaction.reply(Object.assign({}, challengeMessage, { fetchReply: true }))

        awaitButtonPress(reply, target)
            .then(async buttonInteraction => {
                buttonInteraction.deferUpdate()

                if (buttonInteraction?.customId !== 'trivia-yes') {
                    return interaction.editReply(configureMessage(config.Messages.TriviaDenied, interaction.member))
                }

                const players = [interaction.member, targetMember]
                const getOppositePlayer = player => player === 0 ? 1 : 0
                let currentQuestionIndex = 0
                const scores = { 0: 0, 1: 0 }

                /**
                 * @function askQuestion Ask a question to a player
                 * @param {number} player The index of the player to ask the question to
                 */
                const askQuestion = async player => {
                    const question = triviaData[currentQuestionIndex]
                    const answers = [...question.incorrect_answers.map(decodeHTMLEntities), decodeHTMLEntities(question.correct_answer)].sort(() => Math.random() - 0.5)

                    const questionEmbed = configureMessage(config.Messages.TriviaQuestion, players[player], [
                        {
                            name: 'question',
                            value: decodeHTMLEntities(question.question)
                        },
                        {
                            name: 'question-number',
                            value: Math.ceil((currentQuestionIndex + 1) / 2)
                        },
                        {
                            name: 'answer-1',
                            value: answers[0]
                        },
                        {
                            name: 'answer-2',
                            value: answers[1]
                        },
                        {
                            name: 'answer-3',
                            value: answers[2]
                        },
                        {
                            name: 'answer-4',
                            value: answers[3]
                        }
                    ])

                    questionEmbed.components = [
                        new ActionRowBuilder()
                            .addComponents(answers.slice(0, 4).map((answer, index) => {
                                return new ButtonBuilder()
                                    .setLabel(answer)
                                    .setCustomId(`trivia-answer-${index}`)
                                    .setStyle(ButtonStyle.Primary)
                            }))
                    ]

                    await interaction.editReply(questionEmbed)

                    /**
                     * @function endTurn End the current turn
                     * @returns {Promise<void>}
                     */
                    const endTurn = () => {
                        if (currentQuestionIndex === triviaData.length - 1) {
                            if (scores[0] === scores[1]) {
                                return interaction.editReply(configureMessage(config.Messages.TriviaTie, interaction.member, [
                                    {
                                        name: 'opponent-mention',
                                        value: target.toString()
                                    },
                                    {
                                        name: 'score',
                                        value: scores[0]
                                    }
                                ]))
                            }

                            const winner = scores[0] > scores[1] ? 0 : 1
                            const loser = getOppositePlayer(winner)

                            interaction.editReply(configureMessage(config.Messages.TriviaEnd, players[winner], [
                                {
                                    name: 'winner-mention',
                                    value: players[winner].toString()
                                },
                                {
                                    name: 'loser-mention',
                                    value: players[loser].toString()
                                },
                                {
                                    name: 'winner-score',
                                    value: scores[winner]
                                },
                                {
                                    name: 'loser-score',
                                    value: scores[loser]
                                }
                            ]))
                        } else {
                            currentQuestionIndex++
                            askQuestion(getOppositePlayer(player))
                        }
                    }

                    awaitButtonPress(reply, players[player])
                        .then(buttonInteraction => {
                            buttonInteraction.deferUpdate()

                            const answer = answers[buttonInteraction.customId.split('-')[2]]

                            if (answer === question.correct_answer) {
                                scores[player]++

                                interaction.editReply(configureMessage(config.Messages.TriviaCorrect, players[player]))
                            } else {
                                interaction.editReply(configureMessage(config.Messages.TriviaIncorrect, players[player], [
                                    {
                                        name: 'correct-answer',
                                        value: question.correct_answer
                                    }
                                ]))
                            }

                            setTimeout(endTurn, 3000)
                        })
                        .catch(err => {
                            console.error(err)
                            endTurn()
                        })
                }

                askQuestion(0)
            })
            .catch((err) => {
                console.error(err)
                interaction.editReply(configureMessage(config.Messages.TriviaChallengeTimedOut, interaction.member))
            })
    })
