import { VersionType, getVersioningOptions } from '@libs/versioning/versioning-options';
import { INestApplication, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

export class VersioningModule {
  static setup(app: INestApplication) {
    const versioningOptions = getVersioningOptions();

    const versionType =
      versioningOptions.type == VersionType.URI
        ? VersioningType.URI
        : versioningOptions.type == VersionType.HEADER
          ? VersioningType.HEADER
          : VersioningType.URI;

    app.enableVersioning({
      type: versionType,
      defaultVersion: `1`,
      header: versioningOptions.headerName ?? '',
      prefix: versioningOptions.prefix ?? 'v',
    });
  }
}
