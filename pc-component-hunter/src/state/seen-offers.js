const fs = require('fs');
const settings = require('../config/settings');

const { seenOffers: filePath } = settings.paths;

function load() {
  if (!fs.existsSync(filePath)) return new Set();
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function save(seenIds) {
  fs.writeFileSync(filePath, JSON.stringify([...seenIds], null, 2), 'utf8');
}

function markAsSeen(seenIds, newIds) {
  for (const id of newIds) seenIds.add(id);
}

module.exports = { load, save, markAsSeen };
