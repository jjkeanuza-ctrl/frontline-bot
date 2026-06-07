const SENIOR_ROLES = [
  process.env.SENIOR_ROLE_1,
  process.env.SENIOR_ROLE_2,
];
const MOD_ROLE = process.env.MOD_ROLE;

function isSenior(member) {
  return SENIOR_ROLES.some(r => member.roles.cache.has(r));
}

function isMod(member) {
  return member.roles.cache.has(MOD_ROLE) || isSenior(member);
}

function requireSenior(interaction) {
  if (!isSenior(interaction.member)) {
    interaction.reply({ content: '🚫 You need Senior Staff permissions to use this command.', ephemeral: true });
    return false;
  }
  return true;
}

function requireMod(interaction) {
  if (!isMod(interaction.member)) {
    interaction.reply({ content: '🚫 You need Moderator permissions to use this command.', ephemeral: true });
    return false;
  }
  return true;
}

module.exports = { isSenior, isMod, requireSenior, requireMod };
