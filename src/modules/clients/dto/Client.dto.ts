import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto implements Prisma.ClientCreateInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class UpdateClientDto implements Prisma.ClientUpdateInput {
  @IsString()
  name?: string;

  @IsString()
  @IsEmail()
  email?: string;
}
