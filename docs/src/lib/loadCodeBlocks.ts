import fromPairs from 'lodash/fp/fromPairs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const cwd = process.cwd();
const examplesFolder = join(cwd, '..', 'examples');
const miscFolder = join(cwd, 'misc');

export default async function loadCodeBlocks<T extends Record<string, 'example' | 'misc'>>(
  options: T
) {
  const blocks = await Promise.all(
    Object.entries(options).map(async ([path, type]) => [
      path,
      {
        code: await readFile(join(type === 'example' ? examplesFolder : miscFolder, path), 'utf-8'),
        language: path.endsWith('.ts')
          ? 'typescript'
          : path.endsWith('.txt')
          ? 'plaintext'
          : undefined,
        title: type === 'example' ? path.split('/').slice(2).join('/') : path
      }
    ])
  );
  return fromPairs(blocks) as Record<
    keyof T,
    { code: string; language?: 'typescript' | 'plaintext'; title: string }
  >;
}
