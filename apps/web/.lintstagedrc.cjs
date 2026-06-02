const path = require('path');

const WEB_ROOT = path.resolve(__dirname);
const REPO_ROOT = path.resolve(WEB_ROOT, '../..');
const ESLINT_SH = path.join(REPO_ROOT, '.husky/lint-staged-eslint.sh');
const PRETTIER_SH = path.join(REPO_ROOT, '.husky/lint-staged-prettier.sh');

const BATCH_SIZE = process.platform === 'win32' ? 8 : 24;

function toWorkspaceRelative(filePath) {
  if (path.isAbsolute(filePath)) {
    const rel = path.relative(WEB_ROOT, path.normalize(filePath));
    if (!rel.startsWith('..') && rel !== '') {
      return rel.split(path.sep).join('/');
    }
  }
  const normalized = filePath.replace(/\\/g, '/');
  const prefix = 'apps/web/';
  if (normalized.startsWith(prefix)) {
    return normalized.slice(prefix.length);
  }
  return filePath.split(path.sep).join('/');
}

function chunkPaths(paths, size) {
  const batches = [];
  for (let i = 0; i < paths.length; i += size) {
    batches.push(paths.slice(i, i + size));
  }
  return batches;
}

module.exports = {
  '*.{ts,tsx}': (filenames) => {
    const files = filenames.map(toWorkspaceRelative).filter((f) => f.length > 0);
    if (files.length === 0) {
      return [];
    }
    const q = (s) => JSON.stringify(s);
    const batches = chunkPaths(files, BATCH_SIZE);
    const eslintCmds = batches.map((batch) => `${q(ESLINT_SH)} ${batch.map(q).join(' ')}`);
    const prettierCmds = batches.map((batch) => `${q(PRETTIER_SH)} ${batch.map(q).join(' ')}`);
    return [...eslintCmds, ...prettierCmds];
  },
};
