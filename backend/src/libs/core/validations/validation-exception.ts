import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}
