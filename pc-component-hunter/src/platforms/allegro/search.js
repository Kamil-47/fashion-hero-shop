const axios = require('axios');
const settings = require('../../config/settings');
const components = require('../../config/components');

const { apiBase, pageLimit, requestTimeoutMs } = settings.allegro;

async function fetchOffersForPhrase(phrase, componentConfig, token) {
  const params = {
    phrase,
    'price.to': componentConfig.maxPricePLN,
    'sellingMode.format': 'BUY_NOW',
    sort: 'price',
    limit: pageLimit,
  };

  if (componentConfig.allegroCategory) {
    params['category.id'] = componentConfig.allegroCategory;
  }

  try {
    const response = await axios.get(`${apiBase}/offers/listing`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.allegro.public.v1+json',
      },
      timeout: requestTimeoutMs,
    });

    const items = response.data?.items?.regular ?? [];

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      pricePLN: parseFloat(item.sellingMode?.price?.amount ?? 0),
      currency: item.sellingMode?.price?.currency ?? 'PLN',
      condition: item.condition ?? 'UNKNOWN',
      url: `https://allegro.pl/oferta/${item.id}`,
      sellerLogin: item.seller?.login ?? '',
      searchPhrase: phrase,
    }));
  } catch (err) {
    const status = err.response?.status;
    console.warn(
      `[search] Blad zapytania dla "${phrase}" (HTTP ${status ?? 'brak'}):`,
      err.message
    );
    return [];
  }
}

async function searchComponent(componentKey, token) {
  const config = components[componentKey];
  if (!config) throw new Error(`Nieznany klucz komponentu: ${componentKey}`);

  const seen = new Set();
  const results = [];

  for (const phrase of config.searchPhrases) {
    const offers = await fetchOffersForPhrase(phrase, config, token);
    for (const offer of offers) {
      if (!seen.has(offer.id)) {
        seen.add(offer.id);
        results.push(offer);
      }
    }
  }

  return results;
}

async function searchAllComponents(token) {
  const results = {};

  for (const key of Object.keys(components)) {
    console.log(`[search] Szukam: ${components[key].name}...`);
    results[key] = await searchComponent(key, token);
    console.log(`[search]   Znaleziono ${results[key].length} ofert (przed filtrami).`);
  }

  return results;
}

module.exports = { searchComponent, searchAllComponents };
