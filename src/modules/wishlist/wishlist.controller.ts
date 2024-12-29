import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/Wishlist.dto';

@Controller('')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('')
  async create(@Body() data: CreateWishlistDto) {
    return this.wishlistService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.wishlistService.delete(id);
  }
}
