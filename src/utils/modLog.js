const { EmbedBuilder } = require('discord.js');

async function modLog(client, action, target, moderator, reason, extra = {}) {
  const channel = await client.channels.fetch(process.env.MOD_LOGS_CHANNEL).catch(() => null);
  if (!channel) return;

  const colours = {
    BAN: 0xe74c3c,
    KICK: 0xe67e22,
    MUTE: 0xf39c12,
    UNMUTE: 0x2ecc71,
    WARN: 0xf1c40f,
    CLOSE: 0x95a5a6,
  };

  const embed = new EmbedBuilder()
    .setColor(colours[action] || 0x4fc3f7)
    .setTitle(`🛡 ${action}`)
    .addFields(
      { name: 'User', value: `${target.tag || target} (${target.id || target})`, inline: true },
      { name: 'Moderator', value: `${moderator.user.tag}`, inline: true },
      { name: 'Reason', value: reason || 'No reason provided' },
    )
    .setTimestamp();

  if (extra.duration) embed.addFields({ name: 'Duration', value: extra.duration, inline: true });

  await channel.send({ embeds: [embed] });
}

module.exports = { modLog };
