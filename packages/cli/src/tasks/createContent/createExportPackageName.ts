export function createExportPackageName(packageName: string): string {
  if (packageName) {
    return `export const PACKAGE_NAME = '${packageName}'\n\n`;
  }

  return '';
}
