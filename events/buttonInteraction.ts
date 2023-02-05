import { Event } from "../structures/Event";
import { client } from "..";
import embed from "../utils/embed";
import { errorColor } from "../configuration/embeds.json";
import { codeBlock, GuildMemberRoleManager } from "discord.js";
import { ExtendedButtonInteraction } from "../typings/button";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button) return interaction.reply("You have clicked on a non-existent button!");
        if (button.defered) await interaction.deferReply();
        if (button.permissions) {
            if (!interaction.memberPermissions?.has(button.permissions)) {
                const errorEmbed = await embed({ title: 'ERROR', color: errorColor, description: codeBlock(`You are missing the "${button.permissions}" permission(s) to use this button!`) });
                if (button.defered) {
                    return interaction.followUp({ embeds: [errorEmbed] });
                } else {
                    return interaction.reply({ embeds: [errorEmbed] });
                }
            }
        }

        if (button.roles) {
            for (let role of button.roles) {
                const cacheRole = interaction.guild?.roles.cache.get(role as string);
                const memberCache = (interaction.member?.roles as GuildMemberRoleManager).cache;
                if (!memberCache.has(cacheRole!.id)) {
                    const errorEmbed = await embed({ title: 'ERROR', color: errorColor, description: codeBlock(`You are missing the "${cacheRole?.name.toUpperCase()}" role to use this button!`) });
                    if (button.defered) {
                        return interaction.followUp({ embeds: [errorEmbed] });
                    } else {
                        return interaction.reply({ embeds: [errorEmbed] });
                    }
                }
            }
        }

        button.run({
            client,
            interaction: interaction as ExtendedButtonInteraction
        });
    }
});