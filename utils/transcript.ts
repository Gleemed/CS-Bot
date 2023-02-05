import { ExtendedInteraction } from "../typings/command";
import embed from "./embed";
import { errorColor } from "../configuration/embeds.json";
import { exec } from "child_process"
import { AttachmentBuilder } from "discord.js";
import { ExtendedButtonInteraction } from "../typings/button";

export default function transcript(interaction: ExtendedInteraction | ExtendedButtonInteraction) {
    return new Promise(async (resolve, reject) => {

        // Create ticket UUID
        const UUID = await create_UUID()
        async function create_UUID() {
            let dt = Date.now()
            const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = (dt + Math.random() * 16) % 16 | 0
                dt = Math.floor(dt/16)
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
            })
            return uuid
        }

        // Determine OS
        let os: string
        if (process.platform == 'win32') { os = 'windows' }
        else { os = 'linux' }

        // Execute transcript generation
        let transcriptSetup: string
        if (os === 'windows') transcriptSetup = `cd ./dce && DiscordChatExporter.Cli.exe export -t ${process.env.TOKEN} -b -c ${interaction.channelId} -o ../transcripts/${UUID}.html`
        if (os === 'linux') transcriptSetup = `cd ./dce && mono DiscordChatExporter.Cli.exe export -t ${process.env.TOKEN} -b -c ${interaction.channelId} -o ../transcripts/${UUID}.html`


        await runCommand(transcriptSetup!)

        async function runCommand(command: string) {
            exec(command, async (err: any, output: any) => {
                if (err) {
                    const errEm = await embed({ title: 'ERROR', color: errorColor, description: `${err.message}` })
                    reject(errEm)
                }
                const ts = new AttachmentBuilder(`./transcripts/${UUID}.html`)
                resolve(ts)
            })
        }
        
    })   
}