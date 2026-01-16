#!/bin/bash
set -e

echo "🔧 Habilitando Corepack..."
corepack enable

echo "📦 Preparando Yarn 4.0.0..."
corepack prepare yarn@4.0.0 --activate

echo "🎯 Usando Yarn via Corepack diretamente..."
export PATH="$(corepack prepare yarn@4.0.0 --activate 2>&1 | grep -oP '(?<=to\s).*(?=/bin)' || echo ~/.node/corepack)/bin:$PATH"

echo "🧹 Verificando versão do Yarn..."
corepack yarn --version

echo "📥 Instalando dependências..."
corepack yarn install

echo "✅ Instalação concluída!"
