import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
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
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.wishlistService.delete(id);
  }
}
