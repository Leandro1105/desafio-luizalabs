import { Prisma } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto implements Prisma.ProductCreateInput {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  reviewScore: number;
}

export class UpdateProductDto implements Prisma.ProductUpdateInput {
  @IsString()
  title?: string;

  @IsString()
  brand?: string;

  @IsString()
  image?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  reviewScore?: number;
}
