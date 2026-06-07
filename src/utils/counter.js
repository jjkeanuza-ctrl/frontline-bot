const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../../data/counters.json');

function load() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify({ applications: 0, tickets: 0 }));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function nextApplication() {
  const data = load();
  data.applications += 1;
  save(data);
  return String(data.applications).padStart(5, '0');
}

function nextTicket() {
  const data = load();
  data.tickets += 1;
  save(data);
  return String(data.tickets).padStart(4, '0');
}

module.exports = { nextApplication, nextTicket };
