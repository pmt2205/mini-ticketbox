import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateSeatReservationDto {
  @ApiProperty({ format: 'uuid', example: '1c490497-40d4-4a1c-ae6e-bb868ee422c8' })
  @IsUUID()
  ticketTypeId!: string;

  @ApiProperty({ example: 'guest-8ff5ad4f-731d-4e8a-81ee-a45817d3c79c' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'Pham Manh Tuong', minLength: 2 })
  @IsString()
  @MinLength(2)
  customerName!: string;

  @ApiProperty({ example: 'tuong@example.com' })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({ example: '0901234567', minLength: 8 })
  @IsString()
  @MinLength(8)
  customerPhone!: string;

  @ApiProperty({
    type: [String],
    minItems: 1,
    maxItems: 10,
    example: ['21baf0c6-8bc6-4a59-9f42-7d3d9e64bacc'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsUUID(undefined, { each: true })
  seatIds!: string[];
}
