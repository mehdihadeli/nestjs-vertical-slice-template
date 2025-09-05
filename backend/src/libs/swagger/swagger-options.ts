import { ConfigBinder } from '@libs/configurations/config-binder';

export class SwaggerOptions {
  title: string;
  description: string;
  versions: string[];
  path?: string;
  authorName: string;
  authorUrl?: string;
  authorEmail: string;
  licenseName: string;
  licenseUrl: string;
}

export const getSwaggerOptions = (sectionName: string = 'swaggerOptions'): SwaggerOptions =>
  ConfigBinder.getOption<SwaggerOptions>(sectionName);
