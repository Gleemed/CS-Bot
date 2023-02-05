import { GuildMember, ModalBuilder, ModalComponentData, ModalSubmitInteraction } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedModalSubmitInteraction extends ModalSubmitInteraction {
    member: GuildMember
}

interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedModalSubmitInteraction,
}

type RunFunction = (options: RunOptions) => any;

export type ModalType = {
    run: RunFunction
} & ModalComponentData