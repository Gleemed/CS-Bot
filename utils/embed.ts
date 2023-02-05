import config from "../configuration/embeds.json";
import { EmbedBuilder, ColorResolvable } from "discord.js";

export default async function embed(value: any) {
    const embed = new EmbedBuilder();
    value.title ? embed.setTitle(value.title) : embed.setTitle('SUCCESS!');
    value.color ? embed.setColor(value.color) : embed.setColor(config.baseColor as ColorResolvable);
    value.footer ? embed.setFooter({ text: value.footer, iconURL: config.footerIconURL }) : embed.setFooter({ text: config.footer, iconURL: config.footerIconURL });
    if (value.description) embed.setDescription(value.description);
    if (value.fields) embed.setFields(value.fields);
    if (value.image) embed.setImage(value.image);
    if (value.thumbnail) embed.setThumbnail(value.thumbnail);
    if (value.timestamp == true) embed.setTimestamp();
    return embed;
}