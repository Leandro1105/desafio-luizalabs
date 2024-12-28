import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientsModule } from './modules';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'clients',
        module: ClientsModule,
      },
    ]),
    ClientsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
