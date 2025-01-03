import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/Client.dto';
import { Client } from '@prisma/client';
import { PaginationDto } from '../../common/dto/Pagination.dto';
import { DEFAULT_LIMIT } from 'src/utils/constants';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientDto): Promise<Client> {
    const { email } = data;
    const client = await this.prisma.client.findUnique({ where: { email } });

    if (client) throw new ConflictException('Email already in use');

    return this.prisma.client.create({ data });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const skip = (page - 1) * DEFAULT_LIMIT;

    return this.prisma.client.findMany({
      skip,
      take: DEFAULT_LIMIT,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findOne(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Client> {
    return this.prisma.client.delete({ where: { id } });
  }

  async getWishlist(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) throw new NotFoundException('Client not found');

    const wishlist = await this.prisma.wishlist.findMany({
      where: { clientId: id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
            reviewScore: true,
          },
        },
      },
    });

    return wishlist.map(({ product }) => ({
      ...product,
      link: `http://localhost:3000/products/${product.id}`,
    }));
  }
}
