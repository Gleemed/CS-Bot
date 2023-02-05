import { db } from "../..";
import { Command } from "../../structures/Command";
import close from "../../utils/closeTicket";
import embed from "../../utils/embed";
import transcript from "../../utils/transcript";

export default new Command({
    name: "close",
    description: "Close the current ticket.    ",
    defered: true,
    run: async ({ interaction, args, client }) => {
        try {
            const em: any = await close(interaction.member, interaction.channel!)
            return interaction.followUp({ embeds: [em] })
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }
    }
})