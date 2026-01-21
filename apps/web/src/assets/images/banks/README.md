# Logos de Bancos

Este diretório contém os logos dos principais bancos brasileiros em formato PNG.

## Logos Disponíveis

Os seguintes logos estão disponíveis neste diretório (baixados do repositório [Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG)):

1. ✅ **001-banco-do-brasil.svg** - Banco do Brasil
2. ✅ **237-bradesco.svg** - Bradesco
3. ✅ **341-itau.svg** - Itaú Unibanco
4. ✅ **033-santander.svg** - Santander
5. ✅ **104-caixa.svg** - Caixa Econômica Federal
6. ✅ **260-nubank.svg** - Nubank
7. ✅ **077-inter.svg** - Banco Inter
8. ✅ **212-original.svg** - Banco Original
9. ⚠️ **623-pan.svg** - Banco Pan (não disponível no repositório, necessário adicionar manualmente)
10. ✅ **208-btg.svg** - BTG Pactual

## Especificações

- **Formato:** SVG (vetorial, escalável sem perda de qualidade)
- **Tamanho original:** 2500x2500px (do repositório fonte)
- **Background:** Transparente
- **Fonte:** Repositório [Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG) no GitHub
- **Estilo:** Logo oficial do banco em formato vetorial

## Fonte dos Logos

Os logos foram baixados do repositório GitHub:
- **Repositório:** [Tgentil/Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG)
- **Formato:** SVG vetorial
- **Tamanho:** 2500x2500px
- **Licença:** Verificar termos de uso do repositório

### Para Adicionar Novos Logos

1. Verificar se o banco está disponível no repositório [Bancos-em-SVG](https://github.com/Tgentil/Bancos-em-SVG)
2. Baixar o arquivo SVG da pasta correspondente
3. Salvar com o padrão: `{bankCode}-{nome-normalizado}.svg`
4. Atualizar o arquivo `/src/utils/bankIcons.ts` com o novo mapeamento

## Direitos Autorais

⚠️ **IMPORTANTE:** Certifique-se de que você tem permissão para usar os logos dos bancos em sua aplicação.

- Verifique os termos de uso de cada banco
- Considere usar apenas em contextos informativos (ex: identificação de conta do usuário)
- Não use os logos de forma que sugira endosso ou parceria sem autorização
- Mantenha os logos em sua forma original sem modificações significativas

## Fallback

O sistema usa ícones do lucide-react como fallback quando:
- O logo PNG não está disponível
- O logo falha ao carregar
- O banco não está na lista de logos disponíveis

## Adicionando Novos Bancos

Para adicionar logos de novos bancos:

1. Adicione o arquivo PNG neste diretório seguindo o padrão: `{código}-{nome-normalizado}.png`
2. Atualize o arquivo `/src/utils/bankIcons.ts` adicionando:
   - Entrada em `BANK_LOGOS`
   - Entrada em `INSTITUTION_TO_CODE` (para mapeamento por nome)
   - Entrada em `BANK_FALLBACK_ICONS` (ícone de fallback)

## Testando

Após adicionar os logos, teste em diferentes cenários:
- Modo claro e escuro
- Diferentes tamanhos de tela
- Com e sem logos disponíveis
- Verificar fallback quando logo não carrega
