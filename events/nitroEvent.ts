import { Event } from "../structures/Event";
import { client, db } from "..";
import { logChannel } from "../configuration/nitro.json";
import { TextChannel } from "discord.js";
import embed from "../utils/embed";
import { errorColor } from "../configuration/embeds.json";

export default new Event("guildMemberUpdate", async (oldMember, newMember) => {
    const testRole = "1071610645327392879"
    /**
     * MEMBER SUBSCRIBED
     * 
     * If the oldMember DOES NOT HAVE the nitro role
     * AND
     * If the newMember HAS the nitro role
     */
    if ((oldMember.roles.cache.has(oldMember.guild.roles.premiumSubscriberRole!.id)) && !(newMember.roles.cache.has(newMember.guild.roles.premiumSubscriberRole!.id))) {
         try {
            await db.setBoosted(oldMember.id, true)
            const logChan = client.channels.cache.get(logChannel) as unknown as TextChannel
            // @ts-expect-error
            const nitroEm = await embed({ title: 'MEMBER SUBSCRIBED', description: `The user <@${newMember.id}> has Nitro boosted the server!` })
            return await logChan.send({ embeds: [nitroEm] })
         } catch(e: any) {
            console.log(e)
            return
         }
    }

    /**
     * MEMBER UNSUBSCRIBED
     * 
     * If the oldMember HAS the nitro role
     * AND
     * If the newMember DOES NOT HAVE the nitro role
     */
    if (!(oldMember.roles.cache.has(oldMember.guild.roles.premiumSubscriberRole!.id)) && (newMember.roles.cache.has(newMember.guild.roles.premiumSubscriberRole!.id))) {
        try {
            await db.setBoosted(oldMember.user.id, false)
            const logChan = client.channels.cache.get(logChannel) as unknown as TextChannel
            // @ts-expect-error
            const nitroEm = await embed({ title: 'MEMBER UNSUBSCRIBED', color: errorColor, description: `The user <@${newMember.id}> has unsubscribed from their Nitro boost.` })
            return await logChan.send({ embeds: [nitroEm] })
        } catch(e: any) {
            console.log(e)
            return
        }
    }
});