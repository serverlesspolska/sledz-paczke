# Sledz Paczke

Aplikacja napisana w serverless jako przykład w **bezpłatnym** kursie wideo dostępnym w Akademii Serverless Polska.
Więcej informacji https://akademia.serverlesspolska.pl/sledz-paczke/


## Jak używać?

Z racji aktualizacji zależności oraz wersji node.js w AWS Lambda (przejście z wersji 8 na 12), proszę używać najnowszej wersji kodu w branchu `master`. 

Poszczególne lekcje wideo omawiają iteracyjnie rozwój aplikacji. Jeśli będziesz programował razem ze mną to stosuj `node.js 12` **od samego początku** oraz najnowsze wersje bibliotek, a nie te które były dostępne w czasie nagrywania lekcji.

### Jak ustawić node 12?

W pliku `serverless.yml` w sekcji `provider` -> `runtime` umieść wartość `nodejs12.x` (zamiast `nodejs8.10`).

## Testowanie

Po aktualizacji kodu (po przejściu do nowego odcinka) gdy nie działają testy `npm test` warto odświeżyć zależność
```
rm -rf node_modules
npm i
```
i spróbować kolejny raz.

## Stan rozwiązania
Aplikacja została ostatni raz przetestowana z realnym numerem paczki z Poczty Polskiej dnia 14 marca 2020. Wszystko działa sprawnie, SMSy zostały dostarczone 👍😀
