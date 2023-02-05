import { PrismaClient, Tickets, User } from "@prisma/client";
import embed from "../utils/embed";
import { errorColor } from "../configuration/embeds.json";
import { openLimit } from "../configuration/tickets.json";

const prisma = new PrismaClient()

export class Database {

    // Create user method
    private async createUser(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const newUsr = await prisma.user.create({
                    data: {
                        id: id
                    }
                })
                this.disconnect()
                resolve(newUsr)
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err)
            }
        })
    }

    // Get user method
    public async getUser(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: id
                    }
                })
                if (user == null) {
                    await this.createUser(id).then(() => {
                        const usr = this.getUser(id)
                        this.disconnect()
                        resolve(usr)
                    })
                }
                this.disconnect()
                resolve(user)
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err)
            }
        })
    }

    /**
     * Blacklist user method
    */
    public async blacklistUser(id: string) {
        return new Promise(async (resolve, reject) => {
             try {
                const usr = await this.getUser(id) as User
                if (usr.blacklisted == true) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `The user <@${id}> is already blacklisted from opening tickets.` })
                    reject(err)
                }
                await prisma.user.update({
                    data: {
                        blacklisted: true
                    },
                    where: {
                        id: id
                    }
                })
                this.disconnect()
                resolve("user blacklisted")
             } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err)
             }
        })
    }

    /**
     * unblacklist user method
     */
    public async unblacklistUser(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const usr = await this.getUser(id) as User
                if (usr.blacklisted == false) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `The user <@${id}> is not blacklisted!` })
                    reject(err)
                }
                await prisma.user.update({
                    data: {
                        blacklisted: false
                    },
                    where: {
                        id: id
                    }
                })
                this.disconnect()
                resolve("user unblacklisted")
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err)
            }
        })
    }

    // Can open ticket method
    public async canOpen(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getUser(id) as User
                if (user.ticketsOpen >= openLimit) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `You have the maxmimum amount of \`${openLimit}\` tickets open! Please close one before opening another.` })
                    reject(err)  
                } else if (user.blacklisted == true) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `You are blacklisted from opening tickets.` })
                    reject(err)  
                }
                this.disconnect()
                resolve(true)
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err)
            }
        })
    }

    // Create ticket method
    public async createTicket(creator: string, channelid: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const user: any = await this.getUser(creator)
                if (user.ticketsOpen >= openLimit) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `You have the maxmimum amount of \`${openLimit}\` tickets open! Please close one before opening another.` })
                    reject(err)
                } else if (user.blacklisted) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `You are blacklisted from opening tickets!` })
                    reject(err)
                }
                const newAmount = user.ticketsOpen + 1
                const ticket = await prisma.tickets.create({
                    data: {
                        userId: creator,
                        channel: channelid
                    }
                })
                await prisma.user.update({
                    data: {
                        ticketsOpen: newAmount
                    },
                    where: {
                        id: creator
                    }
                })
                this.disconnect()
                resolve(ticket)
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err) 
            }
        })
    }

    // Get ticket method
    public async getTicket(channelid: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const ticket = await prisma.tickets.findUnique({
                    where: {
                        channel: channelid
                    }
                })
                if (ticket == null) {
                    const err = await embed({ title: 'ERROR', color: errorColor, description: `This is not a ticket channel!` })
                    reject(err)
                }
                resolve(ticket)
            } catch(e: any) {
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err)
            }
        })
    }

    // Get tickets method
    public async getTicketAmount() {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await prisma.tickets.count()
                this.disconnect()
                resolve(count)
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err) 
            }
        })
    }

    // Close ticket method
    public async closeTicket(channelid: string, userid: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const usr = await this.getUser(userid) as User
                await prisma.tickets.update({
                    data: {
                        open: false
                    },
                    where: {
                        channel: channelid
                    }
                })
                await prisma.user.update({
                    data: {
                        ticketsOpen: usr.ticketsOpen - 1
                    },
                    where: {
                        id: userid
                    }
                })
                this.disconnect()
                resolve("closed")
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err) 
            }
        })
    }

    /**
     * NITRO METHODS
     */

    // user boosted
    public async setBoosted(userid: string, boolean: boolean) {
        return new Promise(async (resolve, reject) => {
            try {
                const usr = await this.getUser(userid) as User
                await prisma.user.update({
                    data: {
                        premium: boolean
                    },
                    where: {
                        id: userid
                    }
                })
                this.disconnect()
                resolve("updated")
            } catch(e: any) {
                this.disconnect()
                const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
                reject(err) 
            }
        })
    }

    // Private disconnect method
    private async disconnect() {
        try {
            await prisma.$disconnect()
        } catch(e: any) {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        }
    }

}