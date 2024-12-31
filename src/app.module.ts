import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ClientsModule, ProductsModule, WishlistModule } from './modules';
import { PrismaService } from './common/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'login',
        module: AuthModule,
      },
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
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PrismaService,
  ],
})
export class AppModule {}
