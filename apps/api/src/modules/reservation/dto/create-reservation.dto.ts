import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';

export class CreateReservationDto {
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

  @ApiProperty({ minimum: 1, maximum: 10, example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  quantity!: number;
}
