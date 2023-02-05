import { Tickets } from "@prisma/client";
import { Channel, GuildMember, GuildMemberRoleManager } from "discord.js";
import { db } from "..";
import embed from "./embed";
import { errorColor } from "../configuration/embeds.json";
import { client } from "..";
import { staffRole } from "../configuration/tickets.json"

export default async function cancClose(member: GuildMember, channel: Channel) {
    return new Promise(async (resolve, reject) => {
        try {
            const ticket: Tickets = await db.getTicket(channel.id) as Tickets
            const sRole = client.guilds.cache.get(member.guild.id)?.roles.cache.get(staffRole as string)
            const memberCache = (member.roles as GuildMemberRoleManager).cache
            if ((ticket.userId == member.id) || (memberCache.has(sRole!.id))) {
                const succ = await embed({ title: 'NOTICE', description: `You can close this ticket` })
                resolve(succ)
            } else {
                const err = await embed({ title: 'ERROR', color: errorColor, description: `You do not have permission to close this ticket.` })
                reject (err)
            }
        } catch(e: any) {
            const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
            reject(err)
        }
    })
}