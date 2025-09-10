import { Configuration } from '@libs/configurations/configuration';

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
  Configuration.getOption<SwaggerOptions>(sectionName);
