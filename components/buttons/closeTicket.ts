import { ButtonStyle, ComponentType } from "discord.js";
import { Button } from "../../structures/Button";
import { ButtonType } from "../../typings/button";
import button from "../../utils/button";
import canClose from "../../utils/closeTicket";
import embed from "../../utils/embed";

export default new Button({
    customId: "closeTicket",
    label: "Close Ticket",
    style: ButtonStyle.Danger,
    type: ComponentType.Button,
    defered: false,
    run: async ({ interaction, client }) => {
        try {
            await canClose(interaction.member, interaction.channel!)
            let btnArray: Array<ButtonType> = []
            btnArray.push(client.buttons.get("confirmClose") as ButtonType, client.buttons.get("cancelClose") as ButtonType)
            const row: any = await button(btnArray)
            const confirmClose = await embed({ title: 'CONFIRMATION', description: `Are you sure you want to close this ticket?` })
            return interaction.reply({ embeds: [confirmClose], components: [row] })
        } catch(e: any) {
            return interaction.reply({ embeds: [e], ephemeral: true })
        }
    }
});