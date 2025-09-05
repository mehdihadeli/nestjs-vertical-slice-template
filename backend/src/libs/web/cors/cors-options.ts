import { ConfigBinder } from '@libs/configurations/config-binder';
import { registerAs } from '@nestjs/config';

export class CorsOptions {
  allowedOrigins: string[] = [];
  allowedMethods: string[] = [];
  allowedHeaders: string[] = [];
  useCredentials: boolean = false;
}

export const addCorsOptions = (sectionName: string = 'corsOptions') =>
  registerAs(sectionName, (): CorsOptions => ConfigBinder.getOption<CorsOptions>(sectionName))();

export const getCorsOptions = (sectionName: string = 'corsOptions'): CorsOptions =>
  ConfigBinder.getOption<CorsOptions>(sectionName);
