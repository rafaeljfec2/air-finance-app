# Sugestões de Usabilidade e UX

Para melhorar a usabilidade e tornar o controle financeiro básico extremamente fácil e intuitivo, aqui estão algumas sugestões focadas na experiência do usuário (UX), especialmente mobile:

### 1. Botão Flutuante de Ação Rápida (FAB)

No mobile, o polegar é a principal ferramenta de interação.

- **Sugestão:** Adicionar um botão flutuante (`+`) fixo no canto inferior direito da tela.
- **Benefício:** Permite iniciar um lançamento de qualquer lugar do app sem precisar rolar a tela ou procurar o botão "Novo Lançamento".

### 2. Feedback Tátil e Visual (Micro-interações)

O usuário precisa "sentir" que a ação funcionou.

- **Sugestão:** Adicionar vibração (Haptic Feedback) ao salvar um registro e animações suaves de sucesso (ex: um "check" verde aparecendo).
- **Benefício:** Confirmação sensorial imediata da ação, gerando satisfação.

### 3. Teclado Otimizado para Valores

Nada é mais chato que digitar valores e o teclado abrir com letras.

- **Sugestão:** Garantir que o campo de "Valor" abra sempre o teclado numérico (propriedade `inputMode="decimal"`).
- **Benefício:** Reduz o número de toques e agiliza o lançamento.

### 4. Gestos de Swipe (Deslizar)

- **Sugestão:** Na lista de "Últimas Transações", permitir deslizar o item para a esquerda para **Excluir** ou **Editar**.
- **Benefício:** Acelera a manutenção de registros sem precisar abrir a tela de detalhes.

### 5. Pré-seleção Inteligente

- **Sugestão:** Evoluir o modal de seleção (Receita vs Despesa) para que, ao abrir a tela de nova despesa, o campo "Foco" já esteja no valor.
- **Benefício:** O usuário abre, digita o valor, seleciona a categoria e salva. Fluxo extremamente rápido (aprox. 3 segundos).

### 6. "Modo Privacidade" Persistente

- **Sugestão:** O botão de "olho" para ocultar valores deve salvar a preferência do usuário. Se ele ocultou uma vez, ao abrir o app novamente, deve continuar oculto.
- **Benefício:** Segurança visual em ambientes públicos (ônibus, metrô).
