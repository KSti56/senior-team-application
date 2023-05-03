/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Poll Command
 * @module commands/poll
 */

const { Command } = require('../classes')
const configureMessage = require('../utils/configureMessage')
const config = require('../config')
const awaitButtonPress = require('../utils/awaitButtonPress')
const awaitModalSubmit = require('../utils/awaitModalSubmit')
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const _ = require('lodash')

const db = require('better-sqlite3')('main.db')

const customIds = {
    setTitle: config.Messages.CreatePoll.Components[0][0].CustomID,
    setDescription: config.Messages.CreatePoll.Components[0][1].CustomID,
    addOption: config.Messages.CreatePoll.Components[0][2].CustomID,
    send: config.Messages.CreatePoll.Components[0][3].CustomID
}

const modals = {
    setTitle: new ModalBuilder()
        .setCustomId('set-title')
        .setTitle('Set Title')
        .addComponents([
            new ActionRowBuilder()
                .addComponents([
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('Title')
                        .setPlaceholder('Enter a title for your poll')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                ])
        ]),
    setDescription: new ModalBuilder()
        .setCustomId('set-description')
        .setTitle('Set Description')
        .addComponents([
            new ActionRowBuilder()
                .addComponents([
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('Description')
                        .setPlaceholder('Enter a description for your poll')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                ])
        ]),
    addOption: new ModalBuilder()
        .setCustomId('add-option')
        .setTitle('Add an Option')
        .addComponents([
            new ActionRowBuilder()
                .addComponents([
                    new TextInputBuilder()
                        .setCustomId('option-name')
                        .setLabel('Option')
                        .setPlaceholder('Enter the option name')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                ]),
            new ActionRowBuilder()
                .addComponents([
                    new TextInputBuilder()
                        .setCustomId('option-emoji')
                        .setLabel('Emoji')
                        .setPlaceholder('(Optional) Enter an emoji for the option')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                ])
        ])
}

const generatePollSetupEmbed = (member, title, description, options) => configureMessage(config.Messages.CreatePoll, member, [
    {
        name: 'title',
        value: title || ':x: Not Set'
    },
    {
        name: 'description',
        value: description || ':x: Not Set'
    },
    {
        name: 'options',
        value: options?.map(option => `${option.emoji} **${option.name}**`).join('\n') || ':x: Not Set'
    }
])

/**
 * @class Poll Command
 */
module.exports = new Command()
    .importSettings('poll')
    .setExec(async interaction => {
        const rolePermission = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === config.Commands.Poll.Permission.toLowerCase())
        if (rolePermission && !interaction.member.roles.cache.has(rolePermission.id)) return interaction.reply(Object.assign({}, configureMessage(config.Messages.NoPermission, interaction.member), { ephemeral: true }))

        const reply = await interaction.reply(Object.assign({}, generatePollSetupEmbed(interaction.member), { ephemeral: true, fetchReply: true }))

        let title
        let description
        const options = []

        const editPoll = (edit = true) => {
            // Update the embed once a user edits a setting
            if (edit) interaction.editReply(generatePollSetupEmbed(interaction.member, title, description, options))

            // Wait for a button press
            awaitButtonPress(reply, interaction.member)
                .then(async buttonInteraction => {
                    const { customId } = buttonInteraction

                    if (customId === customIds.send) {
                        if (options.length === 0) {
                            return buttonInteraction.reply(Object.assign({}, configureMessage(config.Messages.NotEnoughInformation, interaction.member), { ephemeral: true }))
                        }

                        const pollEmbed = configureMessage(config.Messages.Poll, interaction.member, [
                            {
                                name: 'title',
                                value: title
                            },
                            {
                                name: 'description',
                                value: description
                            },
                            {
                                name: 'options',
                                value: options.map(option => `${option.emoji} **${option.name}** (0)`).join('\n')
                            }
                        ])

                        const components = _.chunk(options, 5)
                            .map((chunk, i) => new ActionRowBuilder()
                                .addComponents(chunk.map((option, optionIndex) => {
                                    const button = new ButtonBuilder()
                                        .setCustomId(`vote-${i * 5 + optionIndex}`)
                                        .setLabel(`${option.name}`)
                                        .setStyle(ButtonStyle.Primary)
                                    if (option.emoji) button.setEmoji(option.emoji)

                                    return button
                                }))
                            )

                        interaction.channel.send(Object.assign({}, pollEmbed, { components })).then(msg => {
                            db.prepare('INSERT INTO polls VALUES (?, ?, ?)').run(msg.id, title, description)
                            options.forEach((option, optionId) => {
                                db.prepare('INSERT INTO poll_options VALUES (?, ?, ?, ?)').run(optionId, msg.id, option.name, option.emoji || '')
                            })
                        })

                        interaction.editReply(configureMessage(config.Messages.PollSent, interaction.member))
                    } else if (customId === customIds.setTitle) {
                        buttonInteraction.showModal(modals.setTitle)

                        awaitModalSubmit(buttonInteraction, 'set-title')
                            .then(modalInteraction => {
                                modalInteraction.deferUpdate()

                                const { fields } = modalInteraction

                                title = fields.getTextInputValue('title')

                                editPoll()
                            })
                            .catch(err => {
                                console.error(err)

                                editPoll()
                            })
                    } else if (customId === customIds.setDescription) {
                        buttonInteraction.showModal(modals.setDescription)

                        awaitModalSubmit(buttonInteraction, 'set-description')
                            .then(modalInteraction => {
                                modalInteraction.deferUpdate()

                                const { fields } = modalInteraction

                                description = fields.getTextInputValue('description')

                                editPoll()
                            })
                            .catch(err => {
                                console.error(err)

                                editPoll()
                            })
                    } else if (customId === customIds.addOption) {
                        buttonInteraction.showModal(modals.addOption)

                        awaitModalSubmit(buttonInteraction, 'add-option')
                            .then(modalInteraction => {
                                modalInteraction.deferUpdate()

                                const { fields } = modalInteraction

                                options.push({
                                    name: fields.getTextInputValue('option-name'),
                                    emoji: fields.getTextInputValue('option-emoji')
                                })

                                editPoll()
                            })
                            .catch(err => {
                                console.error(err)

                                editPoll()
                            })
                    }
                })
                .catch(err => {
                    console.error(err)
                    // TODO
                    reply.delete()
                })
        }

        editPoll(false)
    })
