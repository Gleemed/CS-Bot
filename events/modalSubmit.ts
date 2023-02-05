import { Event } from "../structures/Event";
import { client } from "..";
import { ExtendedModalSubmitInteraction } from "../typings/modal";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);
        modal?.run({
            client,
            interaction: interaction as ExtendedModalSubmitInteraction
        });
    }
});