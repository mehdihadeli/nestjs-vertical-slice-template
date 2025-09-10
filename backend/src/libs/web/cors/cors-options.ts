import { Configuration } from '@libs/configurations/configuration';
import { registerAs } from '@nestjs/config';

export class CorsOptions {
  allowedOrigins: string[] = [];
  allowedMethods: string[] = [];
  allowedHeaders: string[] = [];
  useCredentials: boolean = false;
}

export const addCorsOptions = (sectionName: string = 'corsOptions') =>
  registerAs(sectionName, (): CorsOptions => Configuration.getOption<CorsOptions>(sectionName))();

export const getCorsOptions = (sectionName: string = 'corsOptions'): CorsOptions =>
  Configuration.getOption<CorsOptions>(sectionName);
