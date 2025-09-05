import { ConfigBinder } from '@libs/configurations/config-binder';

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
  ConfigBinder.getOption<VersioningOptions>(sectionName);
