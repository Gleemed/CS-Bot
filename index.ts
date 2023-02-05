import dotenv from "dotenv";
dotenv.config();
import { ExtendedClient } from "./structures/Client";
import { Database } from "./structures/Database";
import { exec } from "child_process";

/**
 * Generate database
 */
runCommand("npx prisma migrate dev --name=data")
async function runCommand(command: string) {
    console.log("Migrating Database (THIS IS NORMAL, IT IS CHECKING FOR CHANGES TO THE SCHEMA, NO DATA WILL BE MODIFIED!)")
    exec(command, async (err: any, output: any) => {
        if (err) {
            console.log(err)
        }
    })
}

export const client = new ExtendedClient();
export const db = new Database();

client.start();