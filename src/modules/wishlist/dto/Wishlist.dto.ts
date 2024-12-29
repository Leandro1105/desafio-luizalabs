import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
