const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available Frontline Bot commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x4fc3f7)
      .setTitle('🤖 Frontline Bot — Commands')
      .setDescription('Here\'s everything I can do:')
      .addFields(
        {
          name: '📋 General',
          value: [
            '`/help` — Show this message',
            '`/website` — Get the website link',
            '`/store` — View store packages',
            '`/apply` — Apply for a staff position',
            '`/ticket` — Open a support ticket',
            '`/status` — View GMOD server status',
          ].join('\n'),
        },
        {
          name: '🔨 Moderation (Mod+)',
          value: [
            '`/warn @user reason` — Issue a warning',
            '`/mute @user duration` — Timeout a member',
            '`/unmute @user` — Remove timeout',
            '`/purge amount` — Bulk delete messages',
          ].join('\n'),
        },
        {
          name: '⚔️ Senior Staff Only',
          value: [
            '`/kick @user reason` — Kick a member',
            '`/ban @user reason` — Ban a member',
          ].join('\n'),
        },
      )
      .setFooter({ text: 'Frontline Networks Bot • frontlinenetx.net' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
