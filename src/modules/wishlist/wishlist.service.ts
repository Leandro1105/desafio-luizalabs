import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateWishlistDto } from './dto/Wishlist.dto';
import { Wishlist } from '@prisma/client';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWishlistDto): Promise<Wishlist> {
    const { clientId, productId } = data;

    const [product, wishlist] = await Promise.all([
      this.prisma.product.findUnique({ where: { id: productId } }),
      this.prisma.wishlist.findFirst({ where: { clientId, productId } }),
    ]);

    if (!product) throw new NotFoundException('Product not found');
    if (wishlist) throw new ConflictException('Already in wishlist');

    return this.prisma.wishlist.create({ data });
  }

  async delete(id: string): Promise<Wishlist> {
    return this.prisma.wishlist.delete({ where: { id } });
  }
}
