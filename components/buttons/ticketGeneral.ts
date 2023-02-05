import { ButtonStyle, ComponentType } from "discord.js";
import { Button } from "../../structures/Button";
import modal from "../../utils/modal";
import { ModalType } from "../../typings/modal";

export default new Button({
    customId: "ticketGeneral",
    label: "Open Ticket",
    style: ButtonStyle.Primary,
    type: ComponentType.Button,
    run: async ({ interaction, client }) => {
        const ticketModal: any = await modal(client.modals.get("ticketCreate") as ModalType);
        return interaction.showModal(ticketModal);
    }
});