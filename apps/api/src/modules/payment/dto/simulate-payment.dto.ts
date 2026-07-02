import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class SimulatePaymentDto {
  @ApiProperty({ format: 'uuid', example: '8d2e21c0-3843-44f9-bf13-7562d3d80915' })
  @IsUUID()
  reservationId!: string;

  @ApiProperty({ example: 'payment-8d2e21c0-3843-44f9-bf13-7562d3d80915-01', minLength: 8 })
  @IsString()
  @MinLength(8)
  idempotencyKey!: string;
}
