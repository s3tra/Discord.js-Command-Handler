import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from 'discord.js';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const commands = [];

const bot = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const setupEvents = async () => {
  const eventFiles = fs
    .readdirSync('./src/events/')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);

    if (event.execute) {
      bot.on(file.replace('.js', ''), event.execute);
    } else {
      console.error(`${file} is missing essential exports.`);
      return;
    }
  }
};

const setupCommands = async () => {
  bot.commands = new Collection();

  const commandFiles = fs
    .readdirSync('./src/commands/')
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);

    if (command.data && command.execute) {
      bot.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.error(`${file} is missing essential exports.`);
      return;
    }
  }
};

const registerCommands = async () => {
  const rest = new REST().setToken(process.env.TOKEN);

  try {
    await rest.put(Routes.applicationCommands(bot.application.id), {
      body: commands,
    });
  } catch (error) {
    console.error('An error occured while registering the commands: ', error);
    return;
  }

  console.log(`${bot.user.username} | Loaded ${commands.length} (/) commands.`);
};

bot.on('ready', async () => {
  await setupEvents();
  await setupCommands();
  await registerCommands();

  console.log(`${bot.user.username} | Ready.`);
});

bot.login(process.env.TOKEN);
