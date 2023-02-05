import { db } from "..";
import embed from "./embed";
import { ChannelType, Guild, PermissionsBitField, User } from "discord.js";

// Config files
import { categories, staffRole } from "../configuration/tickets.json";
import { errorColor } from "../configuration/embeds.json";

export default async function create(user: User, guild: Guild) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.canOpen(user.id)

            const ticketNum = await db.getTicketAmount() as number

            const channel = await guild.channels.create({
                name: `${user.username}-general-${ticketNum + 1}`,
                type: ChannelType.GuildText,
                parent: categories.general,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        id: user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
                    },
                    {
                        id: staffRole,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles]
                    }
                ]
            })
            try {
                await db.createTicket(user.id, channel.id)
                resolve(channel)
            } catch(e: any) {
                reject(e)
            }
        } catch(e: any) {
            if (typeof e == "object") {
                reject(e)
            }
            const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
            reject(err) 
        }
    })
}