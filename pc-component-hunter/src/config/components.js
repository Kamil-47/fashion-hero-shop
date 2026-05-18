// Konfiguracja komponentow do polowania.
// Uzupelnij po dostarczeniu AW2-computer-context.md:
//   - maxPricePLN (cena max za okazje, ponizej ktorej warto zerknac)
//   - searchPhrases (konkretne modele z tabel w context.md)
//   - mustNotContain (slowa dyskwalifikujace oferte)
//
// allegroCategory: ID kategorii Allegro - przyspiesza wyszukiwanie i redukuje szum.
// Mozna je znalezc przez API: GET /sale/categories lub przez URL kategorii na allegro.pl.
// Na razie null = brak filtru kategorialnego.

module.exports = {
  gpu: {
    name: 'Karta graficzna',
    maxPricePLN: 3500,
    allegroCategory: null,
    searchPhrases: [
      'RTX 4080 Super',
      'RTX 4080S',
      'RX 7900 XTX',
      'RTX 4090',
    ],
    mustNotContain: [
      'mining', 'koparka', 'uszkodzona', 'uszkodzony', 'nie dziala',
      'nie dziala', 'bios mod', 'bez gwarancji serwisowej', 'na czesci',
    ],
  },

  cpu: {
    name: 'Procesor',
    maxPricePLN: 1800,
    allegroCategory: null,
    searchPhrases: [
      'Ryzen 7 7800X3D',
      'Ryzen 9 7900X',
      'Core i7-14700K',
      'Core i9-14900K',
    ],
    mustNotContain: [
      'uszkodzony', 'uszkodzona', 'nie dziala', 'nie dziala',
      'wygiety pin', 'wygiete piny', 'na czesci',
    ],
  },

  ram: {
    name: 'Pamiec RAM DDR5',
    maxPricePLN: 600,
    allegroCategory: null,
    searchPhrases: [
      'DDR5 32GB 6000',
      'DDR5 32GB 5600',
      'DDR5 32GB 6400',
      'Corsair Vengeance DDR5',
      'Kingston Fury DDR5 32GB',
      'G.Skill Trident DDR5 32GB',
    ],
    mustNotContain: [
      'uszkodzona', 'nie dziala', 'nie dziala', 'na czesci',
      '16GB',
    ],
  },

  psu: {
    name: 'Zasilacz',
    maxPricePLN: 700,
    allegroCategory: null,
    searchPhrases: [
      'Corsair RM1000x',
      'Corsair HX1000',
      'be quiet Dark Power 1000W',
      'Seasonic Focus GX 1000',
      'ASUS ROG Thor 1000W',
      'zasilacz 1000W 80+ Gold',
      'zasilacz 850W 80+ Gold modularny',
    ],
    mustNotContain: [
      'uszkodzony', 'nie dziala', 'nie dziala', 'na czesci',
      '650W', '550W', '750W',
    ],
  },

  case: {
    name: 'Obudowa ATX',
    maxPricePLN: 500,
    allegroCategory: null,
    searchPhrases: [
      'Fractal Design Define 7',
      'Fractal Design North',
      'be quiet Silent Base 802',
      'Lian Li O11 Dynamic',
      'NZXT H7 Flow',
    ],
    mustNotContain: [
      'uszkodzona', 'uszkodzony', 'zgniota', 'zgniot',
      'rysa', 'mini-ITX',
    ],
  },

  cooler: {
    name: 'Chlodzenie CPU (240mm AIO lub wiezowe)',
    maxPricePLN: 400,
    allegroCategory: null,
    searchPhrases: [
      'Noctua NH-D15',
      'be quiet Dark Rock Pro 4',
      'Corsair H100x',
      'Arctic Liquid Freezer 240',
      'Thermalright Peerless Assassin',
    ],
    mustNotContain: [
      'uszkodzone', 'uszkodzony', 'nie dziala', 'nie dziala',
      'przeciek', 'na czesci',
    ],
  },
};
