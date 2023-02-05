import { Collection, GatewayIntentBits, ApplicationCommandDataResolvable, Client, ClientEvents, ButtonInteraction, REST, Routes } from "discord.js";
import { CommandType } from "../typings/command";
import { ButtonType } from "../typings/button";
import { Event } from "./Event";
import glob from "glob-promise";
import { RegisterCommandsOptions } from "../typings/client";
import { ModalType } from "../typings/modal";

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    buttons: Collection<string, ButtonType> = new Collection();
    modals: Collection<string, ModalType> = new Collection()

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] })
    }

    public async start() {
        await this.registerModules();
        this.login(process.env.TOKEN);
    }

    private async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    // Register commands
    private async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            console.log(`Registering guild commands for ${guildId}`);
            const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
            rest.put(Routes.applicationGuildCommands(process.env.CLIENTID!, process.env.GUILDID!), { body: commands }).then(() => console.log('Finished registering application commands!'));
        } else {
            console.log("Registering global commands");
            this.application?.commands.set(commands);
        }
    }

    private async registerModules() {
        // Buttons
        const buttonPaths = await glob(`**/components/buttons/*.ts`);
        buttonPaths.forEach(async (btnPath) => {
            const button: ButtonType = await this.importFile(`../${btnPath}`);
            if (!button.customId) return console.log(`Button ${btnPath} has no customId!`);

            // Add to collection
            this.buttons.set(button.customId, button);
        });

        // Modals
        const modalPaths = await glob(`**/components/modals/*.ts`);
        modalPaths.forEach(async (modalPath) => {
            const modal: ModalType = await this.importFile(`../${modalPath}`);
            if (!modal.customId) return console.log(`Modal ${modalPath} has no customId!`);

            // Add to collection
            this.modals.set(modal.customId, modal);
        });

        // Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandPaths = await glob(`**/commands/**/*.ts`);
        commandPaths.forEach(async (cmdPath) => {
            const command: CommandType = await this.importFile(`../${cmdPath}`);
            if (!command.name) return console.log(`Command ${cmdPath} has no name!`);

            // Add to collection
            this.commands.set(command.name, command);
            slashCommands.push(command)
        });

        // Ready Event
        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.GUILDID
            });
        });

        // Event
        const eventFiles = await glob(`**/events/*.ts`);
        eventFiles.forEach(async (eventPath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(`../${eventPath}`);
            this.on(event.event, event.run);
        });
    }
}