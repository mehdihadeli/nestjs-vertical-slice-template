import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { DefaultExceptionMapper } from './exception-mapper';
import { ProblemDetailsUtils } from './problem-details-utils';

@Catch()
export class ProblemDetailsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsExceptionFilter.name);
  private readonly exceptionMapper: DefaultExceptionMapper;

  constructor() {
    this.exceptionMapper = new DefaultExceptionMapper();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logException(exception, request);

    const statusCode = this.exceptionMapper.getMappedStatusCode(exception);
    const isDevelopment = process.env.NODE_ENV === 'development';
    const problemDetails = this.exceptionMapper.getMappedProblemDetails(
      exception,
      statusCode,
      request.url,
      isDevelopment,
    );

    const finalProblemDetails = ProblemDetailsUtils.applyDefaults(problemDetails, statusCode);

    response
      .status(finalProblemDetails.status!)
      .setHeader('Content-Type', 'application/problem+json')
      .json(finalProblemDetails);
  }

  private logException(exception: unknown, request: Request): void {
    const method = request.method;
    const url = request.url;

    if (exception instanceof Error) {
      this.logger.error(`Exception occurred: ${exception.message}. Method: ${method} ${url}`, exception.stack);
    } else {
      this.logger.error(`Unknown exception occurred. Method: ${method} ${url}`, JSON.stringify(exception));
    }
  }
}
