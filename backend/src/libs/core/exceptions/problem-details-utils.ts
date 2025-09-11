import { ProblemDetails } from './problem-details';
import { getDefaultProblemDetails } from './problem-details-defaults';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProblemDetailsUtils {
  /**
   * Applies default values to a ProblemDetails object
   * @param problemDetails The ProblemDetails object to enhance
   * @param statusCode Optional status code to use if not provided in problemDetails
   * @returns Enhanced ProblemDetails object with defaults applied
   */
  public static applyDefaults(problemDetails: ProblemDetails, statusCode?: number): ProblemDetails {
    // Create a copy to avoid mutating the original
    const result: ProblemDetails = { ...problemDetails };

    // Set the status code if not provided
    result.status ??= statusCode ?? this.determineStatusCode(result);

    const finalStatusCode = result.status;

    try {
      // Apply defaults if available
      const defaults = getDefaultProblemDetails(finalStatusCode) as { type?: string; title?: string } | undefined;
      if (defaults) {
        result.type = result.type ?? defaults.type;
        result.title = result.title ?? defaults.title;
      }
    } catch {
      // If no default found, set basic defaults
      result.type = result.type ?? 'about:blank';
      result.title = result.title ?? 'An error occurred';
    }

    return result;
  }

  /**
   * Checks if the problem represents a validation error
   * @param problem The ProblemDetails object
   * @returns True if it's a validation problem
   */
  public static isValidationProblem(problem: ProblemDetails): boolean {
    // Check if it's a validation problem by looking for errors property
    return 'errors' in problem && Array.isArray(problem.errors);
  }

  /**
   * Checks if the problem represents a server error
   * @param problem The ProblemDetails object
   * @returns True if it's a server error
   */
  public static isServerError(problem: ProblemDetails): boolean {
    const serverErrorTypes = ['server', 'database', 'internal', 'infrastructure', 'timeout'];

    const type = problem.type?.toLowerCase() || '';
    return serverErrorTypes.some(errorType => type.includes(errorType));
  }

  /**
   * Creates a standardized validation error ProblemDetails object
   * @param errors Array of validation errors
   * @param detail Optional detail message
   * @returns Validation ProblemDetails object
   */
  public static createValidationProblem(errors: any[], detail?: string): ProblemDetails {
    return {
      status: 400,
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
      title: 'Validation Error',
      detail: detail ?? 'One or more validation errors occurred',
      errors: errors,
    };
  }

  /**
   * Creates a standardized not found ProblemDetails object
   * @param resourceName Name of the resource that wasn't found
   * @param resourceId ID of the resource that wasn't found
   * @returns NotFound ProblemDetails object
   */
  public static createNotFoundProblem(resourceName: string, resourceId?: string | number): ProblemDetails {
    const detail = resourceId
      ? `The ${resourceName} with ID '${resourceId}' was not found.`
      : `The requested ${resourceName} was not found.`;

    return {
      status: 404,
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
      title: 'Not Found',
      detail: detail,
    };
  }

  /**
   * Creates a standardized internal server error ProblemDetails object
   * @param detail Optional detail message
   * @returns InternalServerError ProblemDetails object
   */
  public static createInternalServerErrorProblem(detail?: string): ProblemDetails {
    return {
      status: 500,
      type: 'https://tools.ietf.org/html/rfc9110#section-15.6.1',
      title: 'Internal Server Error',
      detail: detail || 'An unexpected error occurred while processing your request.',
    };
  }

  /**
   * Creates a standardized unauthorized ProblemDetails object
   * @param detail Optional detail message
   * @returns Unauthorized ProblemDetails object
   */
  public static createUnauthorizedProblem(detail?: string): ProblemDetails {
    return {
      status: 401,
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5.2',
      title: 'Unauthorized',
      detail: detail ?? 'Authentication is required to access this resource.',
    };
  }

  /**
   * Creates a standardized forbidden ProblemDetails object
   * @param detail Optional detail message
   * @returns Forbidden ProblemDetails object
   */
  public static createForbiddenProblem(detail?: string): ProblemDetails {
    return {
      status: 403,
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5.4',
      title: 'Forbidden',
      detail: detail ?? 'You do not have permission to access this resource.',
    };
  }

  /**
   * Merges multiple ProblemDetails objects into one
   * @param problems Array of ProblemDetails objects to merge
   * @returns Merged ProblemDetails object
   */
  public static mergeProblems(...problems: Partial<ProblemDetails>[]): ProblemDetails {
    const result: ProblemDetails = { status: 500 };

    for (const problem of problems) {
      if (problem.status !== undefined && problem.status >= 400) {
        result.status = problem.status;
      }

      // Merge string properties (last one wins)
      const stringProperties = ['type', 'title', 'detail', 'instance'] as const;
      for (const prop of stringProperties) {
        if (problem[prop] !== undefined) {
          result[prop] = problem[prop];
        }
      }

      // Merge extension properties
      for (const [key, value] of Object.entries(problem)) {
        if (!['status', 'type', 'title', 'detail', 'instance'].includes(key)) {
          result[key] = value;
        }
      }
    }

    return this.applyDefaults(result);
  }

  /**
   * Determines the appropriate status code for a ProblemDetails object
   * @param problem The ProblemDetails object
   * @returns The determined status code
   */
  private static determineStatusCode(problem: ProblemDetails): number {
    if (this.isValidationProblem(problem)) {
      return 400; // Bad Request for validation errors
    }

    if (this.isServerError(problem)) {
      return 500; // Internal Server Error for server-related issues
    }

    return 500; // Default to Internal Server Error
  }
}
