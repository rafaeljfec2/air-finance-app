#!/bin/bash
set -e

echo "📦 Instalando dependências do monorepo..."

# Verificar se Corepack está disponível
if command -v corepack &> /dev/null; then
    echo "🔧 Corepack encontrado, habilitando..."
    corepack enable || echo "⚠️  Aviso: corepack enable falhou, continuando..."
    
    echo "📦 Preparando Yarn 4.0.0..."
    corepack prepare yarn@4.0.0 --activate || echo "⚠️  Aviso: prepare falhou, continuando..."
    
    echo "📥 Instalando com Corepack Yarn..."
    corepack yarn install
else
    echo "⚠️  Corepack não disponível, usando Yarn padrão..."
    
    # Tentar usar npx para instalar e usar yarn
    if ! command -v yarn &> /dev/null || [[ $(yarn --version) != 4.* ]]; then
        echo "📦 Instalando Yarn 4 globalmente via npm..."
        npm install -g yarn@4.0.0
    fi
    
    echo "📥 Instalando dependências..."
    yarn install
fi

echo "✅ Instalação concluída!"
