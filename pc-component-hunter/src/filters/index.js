const components = require('../config/components');

function filterByKeywords(offers, componentKey) {
  const config = components[componentKey];
  const blocklist = (config.mustNotContain ?? []).map((w) => w.toLowerCase());

  if (blocklist.length === 0) return offers;

  return offers.filter((offer) => {
    const title = offer.name.toLowerCase();
    return !blocklist.some((word) => title.includes(word));
  });
}

function filterNew(offers, seenIds) {
  return offers.filter((offer) => !seenIds.has(offer.id));
}

function applyAllFilters(offers, componentKey, seenIds) {
  const afterKeywords = filterByKeywords(offers, componentKey);
  return filterNew(afterKeywords, seenIds);
}

module.exports = { filterByKeywords, filterNew, applyAllFilters };
