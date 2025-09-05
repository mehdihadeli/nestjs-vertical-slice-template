export interface ProblemDetailsDefaultsType {
  type: string;
  title: string;
  detail?: string;
}

export const ProblemDetailsDefaults: Record<number, ProblemDetailsDefaultsType> = {
  400: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
    title: 'Bad Request',
    detail: 'The request could not be understood or was missing required parameters.',
  },
  401: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.2',
    title: 'Unauthorized',
    detail: 'Authentication is required to access this resource.',
  },
  402: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.3',
    title: 'Payment Required',
    detail: 'Payment is required to access this resource.',
  },
  403: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.4',
    title: 'Forbidden',
    detail: 'You do not have permission to access this resource.',
  },
  404: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
    title: 'Not Found',
    detail: 'The requested resource was not found.',
  },
  405: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.6',
    title: 'Method Not Allowed',
    detail: 'The requested method is not allowed for this resource.',
  },
  406: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.7',
    title: 'Not Acceptable',
    detail: 'The requested resource is not available in a format that the client accepts.',
  },
  407: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.8',
    title: 'Proxy Authentication Required',
    detail: 'Proxy authentication is required.',
  },
  408: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.9',
    title: 'Request Timeout',
    detail: 'The request timed out.',
  },
  409: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.10',
    title: 'Conflict',
    detail: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  410: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.11',
    title: 'Gone',
    detail: 'The requested resource is no longer available and will not be available again.',
  },
  411: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.12',
    title: 'Length Required',
    detail: 'The "Content-Length" header is required.',
  },
  412: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.13',
    title: 'Precondition Failed',
    detail: 'One or more preconditions given in the request header fields evaluated to false.',
  },
  413: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.14',
    title: 'Content Too Large',
    detail: 'The request entity is larger than the server is willing or able to process.',
  },
  414: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.15',
    title: 'URI Too Long',
    detail: 'The URI provided was too long for the server to process.',
  },
  415: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.16',
    title: 'Unsupported Media Type',
    detail: 'The request entity has a media type which the server or resource does not support.',
  },
  416: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.17',
    title: 'Range Not Satisfiable',
    detail: 'The portion of the data requested cannot be returned by the server.',
  },
  417: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.18',
    title: 'Expectation Failed',
    detail: 'The expectation given in the Expect request-header field could not be met by this server.',
  },
  418: {
    type: 'https://tools.ietf.org/html/rfc2324#section-2.3.2',
    title: "I'm a teapot",
    detail: 'The server refuses to brew coffee because it is, permanently, a teapot.',
  },
  421: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.20',
    title: 'Misdirected Request',
    detail: 'The request was directed at a server that is not able to produce a response.',
  },
  422: {
    type: 'https://tools.ietf.org/html/rfc4918#section-11.2',
    title: 'Unprocessable Entity',
    detail: 'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  423: {
    type: 'https://tools.ietf.org/html/rfc4918#section-11.3',
    title: 'Locked',
    detail: 'The resource that is being accessed is locked.',
  },
  424: {
    type: 'https://tools.ietf.org/html/rfc4918#section-11.4',
    title: 'Failed Dependency',
    detail: 'The request failed due to failure of a previous request.',
  },
  425: {
    type: 'https://tools.ietf.org/html/rfc8470#section-5.2',
    title: 'Too Early',
    detail: 'The server is unwilling to risk processing a request that might be replayed.',
  },
  426: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.5.22',
    title: 'Upgrade Required',
    detail: 'The client should switch to a different protocol.',
  },
  428: {
    type: 'https://tools.ietf.org/html/rfc6585#section-3',
    title: 'Precondition Required',
    detail: 'The origin server requires the request to be conditional.',
  },
  429: {
    type: 'https://tools.ietf.org/html/rfc6585#section-4',
    title: 'Too Many Requests',
    detail: 'The user has sent too many requests in a given amount of time.',
  },
  431: {
    type: 'https://tools.ietf.org/html/rfc6585#section-5',
    title: 'Request Header Fields Too Large',
    detail: 'The server is unwilling to process the request because its header fields are too large.',
  },
  451: {
    type: 'https://tools.ietf.org/html/rfc7725#section-3',
    title: 'Unavailable For Legal Reasons',
    detail: 'The server is denying access to the resource as a consequence of a legal demand.',
  },
  500: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.1',
    title: 'Internal Server Error',
    detail: 'An error occurred while processing your request.',
  },
  501: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.2',
    title: 'Not Implemented',
    detail: 'The server does not support the functionality required to fulfill the request.',
  },
  502: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.3',
    title: 'Bad Gateway',
    detail: 'The server, while acting as a gateway or proxy, received an invalid response from the upstream server.',
  },
  503: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.4',
    title: 'Service Unavailable',
    detail: 'The server is currently unable to handle the request due to temporary overloading or maintenance.',
  },
  504: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.5',
    title: 'Gateway Timeout',
    detail:
      'The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.',
  },
  505: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.6',
    title: 'HTTP Version Not Supported',
    detail: 'The server does not support the HTTP protocol version used in the request.',
  },
  506: {
    type: 'https://tools.ietf.org/html/rfc2295#section-8.1',
    title: 'Variant Also Negotiates',
    detail: 'Transparent content negotiation for the request results in a circular reference.',
  },
  507: {
    type: 'https://tools.ietf.org/html/rfc4918#section-11.5',
    title: 'Insufficient Storage',
    detail: 'The server is unable to store the representation needed to complete the request.',
  },
  508: {
    type: 'https://tools.ietf.org/html/rfc5842#section-7.2',
    title: 'Loop Detected',
    detail: 'The server detected an infinite loop while processing the request.',
  },
  510: {
    type: 'https://tools.ietf.org/html/rfc2774#section-7',
    title: 'Not Extended',
    detail: 'Further extensions to the request are required for the server to fulfill it.',
  },
  511: {
    type: 'https://tools.ietf.org/html/rfc6585#section-6',
    title: 'Network Authentication Required',
    detail: 'The client needs to authenticate to gain network access.',
  },
};

/**
 * Gets the default ProblemDetails for a given HTTP status code
 * @param statusCode The HTTP status code
 * @returns The default ProblemDetails configuration for the status code
 * @throws Error if no default is found for the status code
 */
export function getDefaultProblemDetails(statusCode: number): ProblemDetailsDefaultsType {
  const details = ProblemDetailsDefaults[statusCode];

  if (!details) {
    // For unknown status codes, create a generic default
    if (statusCode >= 400 && statusCode < 500) {
      return {
        type: 'https://tools.ietf.org/html/rfc9110#section-15.5',
        title: 'Client Error',
        detail: `An client error occurred (status code: ${statusCode}).`,
      };
    } else if (statusCode >= 500 && statusCode < 600) {
      return {
        type: 'https://tools.ietf.org/html/rfc9110#section-15.6',
        title: 'Server Error',
        detail: `An server error occurred (status code: ${statusCode}).`,
      };
    }

    throw new Error(`No default ProblemDetails found for status code ${statusCode}`);
  }

  return details;
}

/**
 * Checks if a status code has a default ProblemDetails configuration
 * @param statusCode The HTTP status code to check
 * @returns True if a default configuration exists for the status code
 */
export function hasDefaultProblemDetails(statusCode: number): boolean {
  return statusCode in ProblemDetailsDefaults;
}

/**
 * Gets all available HTTP status codes that have default ProblemDetails configurations
 * @returns Array of status codes
 */
export function getAvailableStatusCodes(): number[] {
  return Object.keys(ProblemDetailsDefaults).map(Number);
}

/**
 * Gets a fallback ProblemDetails configuration for unknown status codes
 * @param statusCode The unknown status code
 * @returns A fallback ProblemDetails configuration
 */
export function getFallbackProblemDetails(statusCode: number): ProblemDetailsDefaultsType {
  if (statusCode >= 400 && statusCode < 500) {
    return {
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5',
      title: 'Client Error',
      detail: `An client error occurred (status code: ${statusCode}).`,
    };
  } else if (statusCode >= 500 && statusCode < 600) {
    return {
      type: 'https://tools.ietf.org/html/rfc9110#section-15.6',
      title: 'Server Error',
      detail: `An server error occurred (status code: ${statusCode}).`,
    };
  }

  return {
    type: 'about:blank',
    title: 'Unknown Error',
    detail: `An unknown error occurred (status code: ${statusCode}).`,
  };
}

/**
 * Gets the appropriate type URI for a status code
 * @param statusCode The HTTP status code
 * @returns The type URI
 */
export function getTypeForStatusCode(statusCode: number): string {
  try {
    return getDefaultProblemDetails(statusCode).type;
  } catch {
    return getFallbackProblemDetails(statusCode).type;
  }
}

/**
 * Gets the appropriate title for a status code
 * @param statusCode The HTTP status code
 * @returns The title
 */
export function getTitleForStatusCode(statusCode: number): string {
  try {
    return getDefaultProblemDetails(statusCode).title;
  } catch {
    return getFallbackProblemDetails(statusCode).title;
  }
}

/**
 * Gets the appropriate detail message for a status code
 * @param statusCode The HTTP status code
 * @returns The detail message
 */
export function getDetailForStatusCode(statusCode: number): string | undefined {
  try {
    return getDefaultProblemDetails(statusCode).detail;
  } catch {
    return getFallbackProblemDetails(statusCode).detail;
  }
}
