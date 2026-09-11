This folder is no longer needed by the app.

Every planet — including Earth's continents, Mars's Valles Marineris /
Syrtis Major / Hellas Planitia, and Jupiter's Great Red Spot — is now drawn
entirely in code from real coordinates, in src/components/Planet.tsx. There
is nothing to download and no external image is used, so there is no bot
protection or network dependency to fail.

`npm run textures` (scripts/get-textures.mjs) is kept only as an optional,
unused extra: if you ever want to drop real photographic texture maps in
here by hand, Planet.tsx still supports a `texture` prop that would use them
instead of the generated surface. Nothing currently passes that prop, so
this folder can stay empty.
