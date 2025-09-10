import { Configuration } from '@libs/configurations/configuration';

export enum VersionType {
  HEADER = 'header',
  URI = 'uri',
}

export class VersioningOptions {
  type?: VersionType;
  headerName?: string;
  prefix?: string;
}

export const getVersioningOptions = (sectionName: string = 'versioningOptions'): VersioningOptions =>
  Configuration.getOption<VersioningOptions>(sectionName);
