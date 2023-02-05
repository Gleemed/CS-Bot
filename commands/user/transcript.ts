import { db } from "../..";
import { Command } from "../../structures/Command";
import embed from "../../utils/embed";
import transcript from "../../utils/transcript";

export default new Command({
    name: "transcript",
    description: "Generate a transcript for the ticket.",
    defered: true,
    run: async ({ interaction, args, client }) => {
        try {
            await db.getTicket(interaction.channelId)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }
        try {
            const ts: any = await transcript(interaction)
            const tsEm = await embed({ title: 'TRANSCRIPT', description: `The transcript for <#${interaction.channelId}> has been attached!` })
            return interaction.editReply({ embeds: [tsEm], files: [ts] })
        } catch(e: any) {
            interaction.editReply({ embeds: [e] })
        }
    }
})