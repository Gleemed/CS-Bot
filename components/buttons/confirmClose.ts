import { Tickets } from "@prisma/client";
import { bold, ButtonStyle, ComponentType } from "discord.js";
import { db } from "../..";
import { Button } from "../../structures/Button";
import { ExtendedButtonInteraction } from "../../typings/button";
import embed from "../../utils/embed";
import transcript from "../../utils/transcript";
import { transcriptChannel } from "../../configuration/tickets.json"

export default new Button({
    customId: "confirmClose",
    label: "Yes",
    style: ButtonStyle.Success,
    type: ComponentType.Button,
    defered: false,
    run: async ({ interaction, client }) => {
        const closingEm = await embed({ title: 'CLOSING TICKET', description: 'This ticket is closing. The channel will be deleted shortly.' })
        interaction.message.edit({ embeds: [closingEm], components: [] })
        try {
            const ticket: Tickets = await db.getTicket(interaction.channelId) as Tickets
            await db.closeTicket(interaction.channelId, interaction.user.id)
            const ts: any = await transcript(interaction)
            const tsGenerated = await embed({ title: 'TRANSCRIPT GENERATED', description: 'The transcript has been generated. This channel will be deleted in 5 seconds.' })
            await interaction.reply({ embeds: [tsGenerated] })
            setTimeout(async function () {
                await interaction.channel?.delete()
                return await sendTranscripts(interaction, ticket, ts)
            }, 5000)
        } catch(e: any) {
            return interaction.reply({ embeds: [e] })
        }

        async function sendTranscripts(interaction: ExtendedButtonInteraction, ticket: Tickets, ts: any) {
            const ticketClosedEm = await embed({ title: 'TICKET CLOSED', description: `Your ticket in ${bold(interaction.guild?.name as string)} was closed. A transcript has been attached .` })
            const ticketOwner = client.users.cache.get(ticket.userId)
            const tsChannel = client.channels.cache.get(transcriptChannel) as any
            ticketOwner?.send({ embeds: [ticketClosedEm], files: [ts] })
            const tsChannelEm = await embed({ title: 'TICKET CLOSED', description: `A ticket was closed by <@${ticket.userId}>. The transcript is attached.` })
            tsChannel?.send({ embeds: [tsChannelEm], files: [ts] })
            return
        }
    }
});