import { ValidationException } from './validation-exception';

export class Guard {
  private static readonly allowedCurrency = new Set(['USD', 'EUR', 'GBP', 'JPY', 'CAD']);
  private static readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly phoneRegex = /^\+?\(?\+?\d{1,4}\)?[\d\s./-]{9,12}$/;
  private static readonly mobileRegex = /^(?:\+|00)?(\(\d{1,3}\)|\d{1,3})?([1-9]\d{9})$/;
  private static readonly guidRegex = /^0{8}(?:-0{4}){3}-0{12}$/;

  static notNull<T>(value: T | null | undefined, argumentName: string = 'value', message: string | null = null): T {
    if (value === null || value === undefined) {
      throw new ValidationException(message ?? `${argumentName} cannot be null or undefined.`);
    }
    return value;
  }

  static notNullWithException<T>(value: T | null | undefined, exception: Error, message: string | null = null): T {
    if (value === null || value === undefined) {
      if (message) {
        throw new ValidationException(message);
      }
      throw exception;
    }
    return value;
  }

  static notEmpty(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullValue = this.notNull(value, argumentName, message);

    if (notNullValue.length === 0) {
      throw new ValidationException(message ?? `${argumentName} cannot be empty.`);
    }
    return notNullValue;
  }

  static notEmptyOrNull(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    if (value === null || value === undefined || value === '') {
      throw new ValidationException(message ?? `${argumentName} cannot be null or empty.`);
    }
    return value;
  }

  static notNullOrWhiteSpace(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    if (value === null || value === undefined || value.trim().length === 0) {
      throw new ValidationException(message ?? `${argumentName} cannot be null or white space.`);
    }
    return value;
  }

  static notEmptyGuid(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullValue = this.notNull(value, argumentName, message);

    if (this.guidRegex.test(notNullValue)) {
      throw new ValidationException(message ?? `${argumentName} cannot be empty GUID.`);
    }
    return notNullValue;
  }

  static notNegativeOrZero(
    value: number | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): number {
    const notNullValue = this.notNull(value, argumentName, message);

    if (notNullValue <= 0) {
      throw new ValidationException(message ?? `${argumentName} cannot be negative or zero.`);
    }
    return notNullValue;
  }

  static notNegativeOrZeroNullable(
    value: number | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): number {
    return this.notNegativeOrZero(value, argumentName, message);
  }

  static validEmail(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullOrWhiteSpaceValue = this.notNullOrWhiteSpace(value, argumentName, message);

    if (!this.emailRegex.test(notNullOrWhiteSpaceValue)) {
      throw new ValidationException(message ?? `${argumentName} is not a valid email address.`);
    }
    return notNullOrWhiteSpaceValue;
  }

  static validPhoneNumber(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullOrWhiteSpaceValue = this.notNullOrWhiteSpace(value, argumentName, message);

    if (!this.phoneRegex.test(notNullOrWhiteSpaceValue)) {
      throw new ValidationException(message ?? `${argumentName} is not a valid phone number.`);
    }
    return notNullOrWhiteSpaceValue;
  }

  static validMobileNumber(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullOrWhiteSpaceValue = this.notNullOrWhiteSpace(value, argumentName, message);

    if (!this.mobileRegex.test(notNullOrWhiteSpaceValue)) {
      throw new ValidationException(message ?? `${argumentName} is not a valid mobile number.`);
    }
    return notNullOrWhiteSpaceValue;
  }

  static validCurrency(
    value: string | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullOrWhiteSpaceValue = this.notNullOrWhiteSpace(value, argumentName, message);

    const currency = notNullOrWhiteSpaceValue.toUpperCase();
    if (!this.allowedCurrency.has(currency)) {
      throw new ValidationException(
        message ?? `${argumentName} is not a valid currency. Allowed: ${Array.from(this.allowedCurrency).join(', ')}`,
      );
    }
    return notNullOrWhiteSpaceValue;
  }

  static validEnum<T extends object, K extends keyof T>(
    value: T[K] | null | undefined,
    enumType: T,
    argumentName: string = 'value',
    message: string | null = null,
  ): T[K] {
    const notNullValue = this.notNull(value, argumentName, message);

    const validValues = Object.values(enumType);
    if (!validValues.includes(notNullValue)) {
      throw new ValidationException(
        message ?? `${argumentName} is not a valid value for enum. Allowed: ${validValues.join(', ')}`,
      );
    }
    return notNullValue;
  }

  static notDefaultDate(
    value: Date | null | undefined,
    argumentName: string = 'value',
    message: string | null = null,
  ): Date {
    const notNullValue = this.notNull(value, argumentName, message);

    if (notNullValue.getTime() === new Date(0).getTime()) {
      throw new ValidationException(message ?? `${argumentName} cannot be the default date.`);
    }
    return notNullValue;
  }

  static inRange(
    value: number | null | undefined,
    min: number,
    max: number,
    argumentName: string = 'value',
    message: string | null = null,
  ): number {
    const notNullValue = this.notNull(value, argumentName, message);

    if (notNullValue < min || notNullValue > max) {
      throw new ValidationException(message ?? `${argumentName} must be between ${min} and ${max}.`);
    }
    return notNullValue;
  }

  static maxLength(
    value: string | null | undefined,
    maxLength: number,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullValue = this.notNull(value, argumentName, message);

    if (notNullValue.length > maxLength) {
      throw new ValidationException(message ?? `${argumentName} cannot exceed ${maxLength} characters.`);
    }
    return notNullValue;
  }

  static minLength(
    value: string | null | undefined,
    minLength: number,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullValue = this.notNull(value, argumentName, message);

    if (notNullValue.length < minLength) {
      throw new ValidationException(message ?? `${argumentName} must be at least ${minLength} characters.`);
    }
    return notNullValue;
  }

  static matchesRegex(
    value: string | null | undefined,
    regex: RegExp,
    argumentName: string = 'value',
    message: string | null = null,
  ): string {
    const notNullValue = this.notNull(value, argumentName, message);

    if (!regex.test(notNullValue)) {
      throw new ValidationException(message ?? `${argumentName} does not match the required pattern.`);
    }
    return notNullValue;
  }
}

export const guard = Guard;
