import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";
import fs from "fs";
import env from "dotenv";

env.config();
const bot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online.`);

    // Event Handling
    const events = fs.readdirSync("./events")
        .filter((file) => file.endsWith(".js"));

    // Register all events
    for (const file of events) {
        const { execute } = await import(`./events/${file}`);
        const eventName = file.split(".")[0];
        bot.on(eventName, (...args) => execute(...args));
    }

    // Command Handling
    bot.commands = new Collection();
    const arrayCommands = [];

    const commands = fs.readdirSync("./commands")
        .filter((file) => file.endsWith(".js"));

    // Register all commands
    for (const file of commands) {
        const command = await import(`./commands/${file}`);
        
        if (command.data && command.execute) {
            bot.commands.set(command.data.name, command);
            arrayCommands.push(command.data.toJSON());
        } else {
            console.error(`Command at ${file} is missing "data" or "execute" property.`);
        }
    }

    // Register the commands with Discord's API
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        // Register all commands at once
        await rest.put(
            Routes.applicationCommands(bot.user.id),
            { body: arrayCommands }
        );
        
        console.log("Successfully loaded (/) application commands.");
    } catch (error) {
        console.error("Error while registering commands:", error);
    }
});

// Login

bot.login(process.env.TOKEN);