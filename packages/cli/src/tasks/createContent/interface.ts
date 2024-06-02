export type TDependentTypes = Record<string, string[]>;

export interface ICachedPackageOutputsProps {
  [key: string]: string;
}

export interface ICachedEnumsProps {
  [key: string]: boolean;
}

export interface ICachedTypesProps {
  [key: string]: {
    filePath: string;
    packageName: string;
    messageName: string;
  };
}

export interface IGeneratedFilesProps {
  filename: string;
  packageName: string;
}

export interface IPackageExportsProps {
  main?: string;
  types?: string;
  exports?: Record<string, string>;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
  typesVersions?: {
    '*': Record<string, string[]>;
  };
}
