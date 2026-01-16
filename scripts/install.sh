#!/bin/bash
set -e

echo "🔧 Habilitando Corepack..."
corepack enable

echo "📦 Preparando Yarn 4.0.0..."
corepack prepare yarn@4.0.0 --activate

echo "🧹 Verificando versão do Yarn..."
yarn --version

echo "📥 Instalando dependências..."
yarn install

echo "✅ Instalação concluída!"
