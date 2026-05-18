require('dotenv').config();

const { getValidToken } = require('./platforms/allegro/auth');
const { searchAllComponents } = require('./platforms/allegro/search');
const { applyAllFilters } = require('./filters');
const seenOffers = require('./state/seen-offers');
const components = require('./config/components');

async function run() {
  console.log('=== PC Component Hunter ===\n');

  // 1. Pobierz wazny token (device flow przy pierwszym uruchomieniu)
  const token = await getValidToken();

  // 2. Zaladuj widziane oferty
  const seen = seenOffers.load();
  console.log(`[state] Widziane oferty: ${seen.size}\n`);

  // 3. Wyszukaj wszystkie komponenty
  const rawResults = await searchAllComponents(token);

  // 4. Filtruj i zbierz nowe oferty
  let totalNew = 0;
  const newOffersPerComponent = {};

  for (const [key, offers] of Object.entries(rawResults)) {
    const fresh = applyAllFilters(offers, key, seen);
    newOffersPerComponent[key] = fresh;
    totalNew += fresh.length;
  }

  // 5. Wypisz raport do konsoli
  console.log('\n========== RAPORT ==========');
  console.log(`Znaleziono ${totalNew} nowych ofert.\n`);

  for (const [key, offers] of Object.entries(newOffersPerComponent)) {
    if (offers.length === 0) continue;

    console.log(`--- ${components[key].name} (${offers.length} ofert) ---`);
    for (const offer of offers) {
      console.log(`  [${offer.condition}] ${offer.name}`);
      console.log(`  Cena: ${offer.pricePLN} ${offer.currency} | Sprzedajacy: ${offer.sellerLogin}`);
      console.log(`  ${offer.url}`);
      console.log();
    }
  }

  if (totalNew === 0) {
    console.log('Brak nowych ofert od ostatniego uruchomienia.');
  }

  // 6. Zapisz nowe ID jako widziane
  for (const offers of Object.values(newOffersPerComponent)) {
    seenOffers.markAsSeen(seen, offers.map((o) => o.id));
  }
  seenOffers.save(seen);

  console.log(`\n[state] Zapisano. Lacznie widzianych ofert: ${seen.size}`);
}

run().catch((err) => {
  console.error('\n[BLAD KRYTYCZNY]', err.message);
  process.exit(1);
});
