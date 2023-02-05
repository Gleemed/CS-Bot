import { Command } from "../../structures/Command";
import embed from "../../utils/embed";
import { staffRole } from "../../configuration/tickets.json"
import { ApplicationCommandOptionType, User } from "discord.js";
import { db } from "../..";

export default new Command({
    name: "blacklist",
    description: "Change who is blacklited from opening tickets.",
    roles: [staffRole],
    defered: true,
    options: [
        {
            name: "add",
            description: "Add a user to the blacklisted list.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "discord user",
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a user from the blacklisted list.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "discord user",
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        }
    ],
    run: async ({ interaction, args, client }) => {
        const subcommand = args.getSubcommand() as string

        /**
         * Add subcommand
         */
        if (subcommand == "add") {
            try {
                const user = args.data[0].options![0].value as string
                await db.blacklistUser(user)
                const addedEm = await embed({ title: 'USER BLACKLISTED', description: `The user <@${user}> has been blacklisted from opening tickets.` })
                return interaction.followUp({ embeds: [addedEm] })
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
        }

        /**
         * Remove subcommand
         */
        if (subcommand == "remove") {
            try {
                const user = args.data[0].options![0].value as string
                await db.unblacklistUser(user)
                const removedEm = await embed({ title: 'USER UNBLACKLISTED', description: `The user <@${user}> has been unblacklisted from opening tickets.` })
                return interaction.followUp({ embeds: [removedEm] })
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
        }
    }
})