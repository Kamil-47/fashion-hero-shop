# Product Spec: Fake Door - "Jak poprawić sprzedaż?"

## Kontekst projektu

FashionHero to marketplace modowy (Next.js 16, TypeScript, Tailwind). Baza kodu to klon Allbirds przerobiony na multi-seller marketplace. Wszystkie dane są hardcoded - brak backendu.

Celem tego feature'a jest smoke test: sprawdzamy, czy sprzedawcy ze strumienia `paid_campaign` klikają w opcję "Jak poprawić sprzedaż?". Metryka sukcesu: CTR >= 15%.

---

## Co budujemy

Nową stronę - panel sprzedawcy (`/seller-dashboard`) z jednym kluczowym elementem: przyciskiem "Jak poprawić sprzedaż?", który otwiera pop-up z informacją, że funkcja jest w przygotowaniu.

---

## Strona: `/seller-dashboard`

### Co pokazujemy

Panel to **szkic** - nie pełny dashboard. Pokazuje tyle, żeby wyglądało wiarygodnie. Hardcoded dane dla przykładowej sprzedawczyni "Dorota" ze strumienia `paid_campaign`.

Elementy panelu (pomocnicze, nie główny cel):
- Nagłówek z imieniem sprzedawczyni i informacją o koncie (np. "Dorota | Plan: Podstawowy")
- Kilka statystyk: liczba produktów, liczba zamówień, przychód (hardcoded, wiarygodne wartości)
- Główny CTA: przycisk **"Jak poprawić sprzedaż?"**

### Przycisk "Jak poprawić sprzedaż?"

- Wyraźnie widoczny - nie schowany w menu
- Styl: primary button z istniejącego design systemu FashionHero
- Po kliknięciu: otwiera modal/pop-up

---

## Modal po kliknięciu przycisku

### Zawartość

```
[X] (przycisk zamknięcia - prawy górny róg)

Tytuł: "Już wkrótce!"

Treść: "Pracujemy nad narzędziem, które pomoże Ci zwiększyć sprzedaż.
Dziękujemy za zainteresowanie - to dla nas ważny sygnał.
Daj znać kiedy będzie gotowe?"

Przycisk: "Zamknij"
```

### Zachowanie

- Otwiera się po kliknięciu przycisku "Jak poprawić sprzedaż?"
- Zamyka się przyciskiem X (prawy górny róg) lub przyciskiem "Zamknij"
- Zamyka się klikając poza modalem (overlay)
- Modal jest wyśrodkowany na ekranie z półprzezroczystym overlay

---

## Wymagania techniczne

- Routing: nowa strona `/seller-dashboard` w `src/app/seller-dashboard/page.tsx`
- Komponenty: trzymaj się istniejących komponentów i tokenów designu (font, spacing, kolory, przyciski z reszty projektu)
- Responsywność: mobile-first, działa na telefonie i desktopie
- State: `useState` do otwierania/zamykania modalu - bez zewnętrznych bibliotek
- TypeScript strict, named exports, Tailwind only

## Czego NIE budujemy

- Nie budujemy miernika CTR ani logiki analitycznej
- Nie budujemy pełnego panelu sprzedawcy (tylko wiarygodny szkic)
- Nie budujemy faktycznych treści o poprawie sprzedaży
- Nie dodajemy logowania ani autentykacji
- Nie tworzymy dodatkowych podstron z menu dashboardu
