import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/Wishlist.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Roles(Role.Admin)
  @Post('')
  async create(@Body() data: CreateWishlistDto) {
    return this.wishlistService.create(data);
  }

  @Roles(Role.Admin)
  @Delete(':clientId/:productId')
  async delete(
    @Param('clientId') clientId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.delete(clientId, productId);
  }

  @Roles(Role.Admin)
  @Get(':clientId')
  async getWishlist(@Param('clientId') clientId: string) {
    return this.wishlistService.getWishlist(clientId);
  }
}
