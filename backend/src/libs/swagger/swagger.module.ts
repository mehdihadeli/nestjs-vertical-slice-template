import { Guard } from '@libs/core/validations/guard';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule as NestJsSwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

import { getSwaggerOptions } from './swagger-options';

// ref: https://github.com/nestjs/swagger/blob/master/lib/swagger-module.ts

export class SwaggerModule {
  static setup(app: INestApplication, includeModules?: any[], optionSectionName: string = 'swaggerOptions'): void {
    let swaggerOptions = getSwaggerOptions(optionSectionName);

    swaggerOptions = Guard.notNull(swaggerOptions, optionSectionName);
    const baseSwaggerPath = `/${swaggerOptions?.path ?? 'swagger'}`;
    const versions: string[] = swaggerOptions?.versions ?? ['v1'];
    const defaultSwaggerVersion = versions[0];

    versions.forEach(version => {
      const config = new DocumentBuilder()
        .setTitle(swaggerOptions.title)
        .setDescription(swaggerOptions.description)
        .setVersion(version)
        .setContact(swaggerOptions.authorName, swaggerOptions.authorUrl ?? '', swaggerOptions.authorEmail)
        .setLicense(swaggerOptions.licenseName, swaggerOptions.licenseUrl)
        .addBearerAuth()
        .build();

      const document = NestJsSwaggerModule.createDocument(app, config, {
        include: includeModules ?? [],
        ignoreGlobalPrefix: false,
      });

      const versionPath = `${version}/${swaggerOptions.path ?? 'swagger'}`;

      NestJsSwaggerModule.setup(versionPath, app, document);
    });

    app.use((req: Request, res: Response, next: NextFunction): void => {
      const isBasePath = req.path === baseSwaggerPath;
      const endsWithVersion = versions.some(version => req.path === `${baseSwaggerPath}/${version}`);

      if (isBasePath && !endsWithVersion) {
        return res.redirect(`${defaultSwaggerVersion}${baseSwaggerPath}/${req.url.slice(baseSwaggerPath.length)}`);
      }
      next();
    });
  }
}
