import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Product } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { DEFAULT_LIMIT } from 'src/utils/constants';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const skip = (page - 1) * DEFAULT_LIMIT;

    return this.prisma.product.findMany({
      skip,
      take: DEFAULT_LIMIT,
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
