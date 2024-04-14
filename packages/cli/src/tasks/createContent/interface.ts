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
