import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from 'src/common/prisma.service';
import { ClientsController } from './clients.controller';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
