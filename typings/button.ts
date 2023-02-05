import { ButtonInteraction, GuildMember, InteractionButtonComponentData, PermissionResolvable, RoleResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";

export interface ExtendedButtonInteraction extends ButtonInteraction {
    member: GuildMember
}

interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedButtonInteraction,
}

type RunFunction = (options: RunOptions) => any;

export type ButtonType = {
    permissions?: PermissionResolvable[]
    roles?: RoleResolvable[]
    defered?: Boolean
    run: RunFunction
} & InteractionButtonComponentData