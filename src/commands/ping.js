import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const execute = async (interaction) => {
  await interaction.reply({
    content: 'Pong!',
  });
};

export { data, execute };
