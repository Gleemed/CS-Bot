import { Command } from '../../structures/Command'
import { ButtonType } from '../../typings/button';
import button from '../../utils/button';
import embed from '../../utils/embed';
import { panelName } from "../../configuration/tickets.json";

export default new Command({
    name: "panel",
    description: "Create a ticket panel.",
    permissions: ["Administrator"],
    defered: false,
    options: [
        {
            name: "create",
            description: "Create the ticket panel in your current channel.",
            type: 1,
        },
    ],
    run: async ({ interaction, args, client }) => {

        let subcommand: string = args.getSubcommand();

        // Create subcommand
        if (subcommand == "create") {
            let btnArray: Array<ButtonType> = [];
            btnArray.push(client.buttons.get("ticketGeneral") as ButtonType);
            let row: any
            try {
                row = await button(btnArray);
            } catch(e: any) {
                return interaction.reply({ embeds: [e] })
            }

            const panelEmbed = await embed({ title: panelName, description: `Click the button below to open a ticket.`, timestamp: false });
            await interaction.channel?.send({ embeds: [panelEmbed], components: [row] });
            return await interaction.reply({ content: "Panel has been created.", ephemeral: true });
        }
    }
})