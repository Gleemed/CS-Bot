import { ButtonStyle, ComponentType } from "discord.js";
import { Button } from "../../structures/Button";
import embed from "../../utils/embed";
import { errorColor } from "../../configuration/embeds.json";

export default new Button({
    customId: "cancelClose",
    label: "No",
    style: ButtonStyle.Danger,
    type: ComponentType.Button,
    defered: false,
    run: async ({ interaction, client }) => {
        try {
            await interaction.message.delete()
        } catch(e: any) {
            const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
            return interaction.reply({ embeds: [err], ephemeral: true })
        }
        const em = await embed({ title: 'CANCELLED', description: "You have cancelled the closing of this ticket." })
        return interaction.reply({ embeds: [em], ephemeral: true })
    }
});