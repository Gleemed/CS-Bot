import { Event } from "../structures/Event";
import { client } from "..";
import embed from "../utils/embed";
import { errorColor } from "../configuration/embeds.json";
import { codeBlock, CommandInteractionOptionResolver, GuildMemberRoleManager } from "discord.js";
import { ExtendedInteraction } from "../typings/command";

export default new Event("interactionCreate", async (interaction) => {
    // Chat input commands
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply("You have used a non existent command!");
        if (command.defered) await interaction.deferReply();
        if (command.permissions) {
            if (!interaction.memberPermissions?.has(command.permissions)) {
                const errorEmbed = await embed({ title: 'ERROR', color: errorColor, description: codeBlock(`You are mssing "${command.permissions}" permission(s) to run this command!`) });
                if (command.defered) {
                    return interaction.followUp({ embeds: [errorEmbed] });
                } else {
                    return interaction.reply({ embeds: [errorEmbed] });
                }
            }
        }
        
        if (command.roles) {
            for (let role of command.roles) {
                const cacheRole = interaction.guild?.roles.cache.get(role as string);
                const memberCache = (interaction.member?.roles as GuildMemberRoleManager).cache;
                if (!memberCache.has(cacheRole!.id)) {
                    const errorEmbed = await embed({ title: 'ERROR', color: errorColor, description: codeBlock(`You are missing the "${cacheRole?.name.toUpperCase()}" role to run this command!`) });
                    if (command.defered) {
                        return interaction.followUp({ embeds: [errorEmbed] });
                    } else {
                        return interaction.reply({ embeds: [errorEmbed] });
                    }
                }
            }
        }

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
})