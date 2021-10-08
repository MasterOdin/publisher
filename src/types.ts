export interface PackageJson {
  name?: string;
  scripts?: {[key: string]: string};
  dependencies?: {[key: string]: string};
  devDependencies?: {[key: string]: string};
  bin?: {[key: string]: string};
  main?: string;
  types?: string;
  publisherrc?: PublisherConfig;
}

export interface PublisherConfig {
  steps?: string[];
  outDir?: string;
  publish?: boolean;
  clean?: boolean;
  project?: string;
}
