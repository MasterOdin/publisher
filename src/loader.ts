import fs from 'fs';
import { resolve } from 'path';
import stripJsonComments from 'strip-json-comments';

export interface TsConfigJson {
  extends?: string;
  compilerOptions?: {
    outDir?: string;
  };
}

export function loadTsConfig(cwd: string, configName: string): TsConfigJson {
  const trailingCommaRegex = /,(?=\s*?[}\]])/g;

  const loadTsConfigFile = (path: string): TsConfigJson => {
    return JSON.parse(stripJsonComments(fs.readFileSync(path, { encoding: 'utf8' })).replace(trailingCommaRegex, '')) as TsConfigJson;
  };

  let tsconfig = loadTsConfigFile(resolve(cwd, configName));
  while (tsconfig.extends) {
    const newTsConfig = loadTsConfigFile(resolve(cwd, tsconfig.extends));
    tsconfig = {
      ...tsconfig,
      ...newTsConfig,
      extends: newTsConfig.extends,
      compilerOptions: {
        ...tsconfig.compilerOptions,
        ...newTsConfig.compilerOptions,
      },
    };
  }
  return tsconfig;
}
