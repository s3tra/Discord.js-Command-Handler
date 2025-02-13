import { MessageFlags } from 'discord.js';

const execute = async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return console.error(
        `No command matching ${interaction.commandName} was found.`
      );
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: 'An error occured while executing the command.',
        flags: MessageFlags.Ephemeral,
      });

      return console.error(
        `An error occured while executing ${interaction.commandName}: `,
        error
      );
    }
  }
};

export { execute };
