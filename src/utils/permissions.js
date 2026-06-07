const SENIOR_ROLES = [
  process.env.SENIOR_ROLE_1,
  process.env.SENIOR_ROLE_2,
];
const MOD_ROLE = process.env.MOD_ROLE;

function isSenior(member) {
  if (!member) return false;
  return SENIOR_ROLES.filter(Boolean).some(r => member.roles.cache.has(r));
}

function isMod(member) {
  if (!member) return false;
  if (!MOD_ROLE) return isSenior(member);
  return member.roles.cache.has(MOD_ROLE) || isSenior(member);
}

async function requireSenior(interaction) {
  if (!isSenior(interaction.member)) {
    await interaction.reply({
      content: '🚫 You need **Senior Staff** permissions to use this command.',
      ephemeral: true
    });
    return false;
  }
  return true;
}

async function requireMod(interaction) {
  if (!isMod(interaction.member)) {
    await interaction.reply({
      content: '🚫 You need **Moderator** permissions to use this command.',
      ephemeral: true
    });
    return false;
  }
  return true;
}

module.exports = { isSenior, isMod, requireSenior, requireMod };
