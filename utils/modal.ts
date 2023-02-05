import { APIModalComponent, ModalBuilder } from "discord.js";
import embed from "./embed";
import { errorColor } from "../configuration/embeds.json";
import { ModalType } from "../typings/modal";

export default async function modal(value: ModalType) {
    return new Promise(async (resolve, reject) => {
        try {
            const modal = ModalBuilder.from(value as unknown as APIModalComponent)
            resolve(modal)
        } catch(e: any) {
            const err = await embed({ title: 'ERROR', color: errorColor, description: `${e.message}` });
            reject(err)
        }
    });
}