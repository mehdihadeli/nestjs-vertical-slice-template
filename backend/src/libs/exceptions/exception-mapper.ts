import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  HttpStatus,
  HttpVersionNotSupportedException,
  ImATeapotException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ProblemDetails } from './problem-details';

@Injectable()
export class DefaultExceptionMapper {
  getMappedStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    switch (exception?.constructor) {
      case BadRequestException:
        return HttpStatus.BAD_REQUEST;
      case UnauthorizedException:
        return HttpStatus.UNAUTHORIZED;
      case ForbiddenException:
        return HttpStatus.FORBIDDEN;
      case NotFoundException:
        return HttpStatus.NOT_FOUND;
      case MethodNotAllowedException:
        return HttpStatus.METHOD_NOT_ALLOWED;
      case NotAcceptableException:
        return HttpStatus.NOT_ACCEPTABLE;
      case RequestTimeoutException:
        return HttpStatus.REQUEST_TIMEOUT;
      case ConflictException:
        return HttpStatus.CONFLICT;
      case GoneException:
        return HttpStatus.GONE;
      case PayloadTooLargeException:
        return HttpStatus.PAYLOAD_TOO_LARGE;
      case UnsupportedMediaTypeException:
        return HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      case UnprocessableEntityException:
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case InternalServerErrorException:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case NotImplementedException:
        return HttpStatus.NOT_IMPLEMENTED;
      case ImATeapotException:
        return HttpStatus.I_AM_A_TEAPOT;
      case BadGatewayException:
        return HttpStatus.BAD_GATEWAY;
      case ServiceUnavailableException:
        return HttpStatus.SERVICE_UNAVAILABLE;
      case GatewayTimeoutException:
        return HttpStatus.GATEWAY_TIMEOUT;
      case PreconditionFailedException:
        return HttpStatus.PRECONDITION_FAILED;
      case HttpVersionNotSupportedException:
        return HttpStatus.HTTP_VERSION_NOT_SUPPORTED;
      default:
        // Handle other common error patterns
        if (exception instanceof Error) {
          switch (exception.constructor) {
            case TypeError:
            case RangeError:
            case SyntaxError:
              return HttpStatus.BAD_REQUEST;
            case AggregateError:
              return HttpStatus.INTERNAL_SERVER_ERROR;
          }
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  getMappedProblemDetails(
    exception: unknown,
    statusCode: number,
    requestUrl: string,
    isDevelopment: boolean = false,
  ): ProblemDetails {
    const problemDetails: ProblemDetails = {
      status: statusCode,
      instance: requestUrl,
    };

    // Add exception-specific details
    if (exception instanceof Error) {
      problemDetails.detail = exception.message;
      problemDetails.title = exception.constructor.name;

      // Add stack trace in development mode
      if (isDevelopment) {
        problemDetails.stackTrace = exception.stack;
      }
    }

    // Handle validation errors specifically
    if (exception instanceof BadRequestException || exception instanceof UnprocessableEntityException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        if ('message' in response && Array.isArray(response.message)) {
          problemDetails.errors = response.message;
        }
      }
    }

    return problemDetails;
  }
}
