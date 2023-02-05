import { ComponentType, TextChannel, TextInputStyle } from "discord.js";
import { Modal } from "../../structures/Modal";
import { ButtonType } from "../../typings/button";
import create from "../../utils/createTicket";
import embed from "../../utils/embed";
import button from "../../utils/button";

export default new Modal({
    customId: "ticketCreate",
    title: "Create Ticket",
    components: [
        {
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.TextInput,
                    customId: "1",
                    style: TextInputStyle.Short,
                    label: "What is your reason for opening a ticket?",
                    maxLength: 100,
                    required: true,
                }
            ],
        }
    ],
    run: async ({ interaction, client }) => {
        try {
            const ticket: TextChannel = await create(interaction.user, interaction.guild!) as TextChannel
            const reason = interaction.fields.getTextInputValue("1")
            const ticketEm = await embed({ title: `Cqmbo Squad Ticket`, fields: [
                { name: 'OPENED BY:', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'OPENED', value: `<t:${Math.floor(Date.now()/1000)}:D>`, inline: true },
                { name: 'REASON:', value: `${reason}`, inline: false }
            ] })
            const btnList: ButtonType[] = []
            btnList.push(client.buttons.get("closeTicket") as ButtonType)
            const closeBtn: any = await button(btnList)
            await ticket.send({ embeds: [ticketEm], components: [closeBtn] })
            await ticket.send(`<@${interaction.user.id}>`).then((m) => {
                setTimeout(function() {
                    m.delete()
                }, 1000)
            })
            const openedEm = await embed({ tite: 'TICKET OPENED', description: `You're ticket has been opened, you can view it here: <#${ticket.id}>` })
            return interaction.reply({ embeds: [openedEm], ephemeral: true })
        } catch(e: any) {
            return interaction.reply({ embeds: [e], ephemeral: true });
        }
    }
});