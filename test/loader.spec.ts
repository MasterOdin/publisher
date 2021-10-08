import { join } from 'path';

import { loadTsConfig } from '../src/loader';

describe('parseTsConfig', (): void => {
  test('parsing tsconfig.json', (): void => {
    expect(loadTsConfig(join(__dirname, 'test_files'), 'tsconfig.json')).toBeTruthy();
  });

  test('parsing tsconfig.json extends', (): void => {
    expect(loadTsConfig(join(__dirname, 'test_files', 'extended_tsconfigs', 'foo'), 'tsconfig.json')).toEqual({
      compilerOptions: {
        noEmit: false,
        declaration: true,
        target: 'ES2020',
      },
      includes: ['foo'],
    });
  });
});
