import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientsModule } from './modules';
import { PrismaService } from './common/prisma.service';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'clients',
        module: ClientsModule,
      },
      {
        path: 'products',
        module: ProductsModule,
      },
      {
        path: 'wishlist',
        module: WishlistModule,
      },
    ]),
    ClientsModule,
    ProductsModule,
    WishlistModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
