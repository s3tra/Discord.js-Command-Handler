const execute = async () => {
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
      return console.error(
        `An error occured while executing ${interaction.commandName}: `,
        error
      );
    }
  }
};

export { execute };
