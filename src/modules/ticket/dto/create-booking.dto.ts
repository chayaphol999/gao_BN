import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  tripId: string;

  @IsString()
  seatNumber: string;

  @IsString()
  paymentMethod: string;

  @IsIn(['SUCCESS', 'PENDING'])
  paymentStatus: string;

  @IsOptional()
  @IsDateString()
  bookingDate?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}