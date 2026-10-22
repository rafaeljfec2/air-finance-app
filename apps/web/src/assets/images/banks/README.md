# Bank logos

This directory contains logos for major Brazilian banks in PNG format.

## Available logos

The following logos are available in this directory (downloaded from the [Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG) repository):

1. ✅ **001-banco-do-brasil.svg** — Banco do Brasil
2. ✅ **237-bradesco.svg** — Bradesco
3. ✅ **341-itau.svg** — Itaú Unibanco
4. ✅ **033-santander.svg** — Santander
5. ✅ **104-caixa.svg** — Caixa Econômica Federal
6. ✅ **260-nubank.svg** — Nubank
7. ✅ **077-inter.svg** — Banco Inter
8. ✅ **212-original.svg** — Banco Original
9. ⚠️ **623-pan.svg** — Banco Pan (not available in the repository; add manually)
10. ✅ **208-btg.svg** — BTG Pactual

## Specifications

- **Format:** SVG (vector, scalable without quality loss)
- **Original size:** 2500x2500px (from the source repository)
- **Background:** Transparent
- **Source:** [Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG) on GitHub
- **Style:** Official bank logo in vector format

## Logo source

Logos were downloaded from the GitHub repository:

- **Repository:** [Tgentil/Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG)
- **Format:** SVG vector
- **Size:** 2500x2500px
- **License:** Check the repository terms of use

### Adding new logos

1. Check whether the bank is available in [Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG)
2. Download the SVG file from the corresponding folder
3. Save using the pattern: `{bankCode}-{nome-normalizado}.svg`
4. Update `/src/utils/bankIcons.ts` with the new mapping

## Copyright

⚠️ **IMPORTANT:** Make sure you have permission to use bank logos in your application.

- Check each bank’s terms of use
- Consider using logos only in informational contexts (e.g., identifying the user’s account)
- Do not use logos in a way that suggests endorsement or partnership without authorization
- Keep logos in their original form without significant modifications

## Fallback

The system uses lucide-react icons as a fallback when:

- The PNG logo is not available
- The logo fails to load
- The bank is not in the list of available logos

## Adding new banks

To add logos for new banks:

1. Add the PNG file in this directory following the pattern: `{code}-{normalized-name}.png`
2. Update `/src/utils/bankIcons.ts` by adding:
   - An entry in `BANK_LOGOS`
   - An entry in `INSTITUTION_TO_CODE` (name-based mapping)
   - An entry in `BANK_FALLBACK_ICONS` (fallback icon)

## Testing

After adding logos, test in different scenarios:

- Light and dark mode
- Different screen sizes
- With and without available logos
- Verify fallback when a logo fails to load
