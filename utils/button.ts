import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { APIMessageComponentEmoji, ButtonStyle } from "discord.js";
import { ButtonType } from "../typings/button";
import embed from "./embed";
import { errorColor } from "../configuration/embeds.json";

export default async function button(btnList: Array<ButtonType>) {
    return new Promise(async (resolve, reject) => {
        try {
            let row = new ActionRowBuilder<any>();
            for (let btn of btnList) {
                let newButton = new ButtonBuilder();
                btn.customId ? newButton.setCustomId(btn.customId) : newButton.setCustomId(Math.random().toString());
                btn.style ? newButton.setStyle(btn.style) : newButton.setStyle(ButtonStyle.Primary);
                if (btn.disabled) newButton.setDisabled(true);
                if (btn.label) newButton.setLabel(btn.label);
                if (btn.emoji) newButton.setEmoji(btn.emoji as APIMessageComponentEmoji);
                row.addComponents(newButton);
            }
            resolve(row)
        } catch(e: any) {
            console.log(e)
            let err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` })
            reject(err)
        }
    });
}