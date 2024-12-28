import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/Client.dto';
import { PaginationDto } from '../../common/dto/Pagination.dto';

@Controller('')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const client = await this.clientsService.findOne(id);

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }

  @Post('')
  async create(@Body() data: CreateClientDto) {
    return this.clientsService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateClientDto) {
    const client = await this.clientsService.update(id, data);

    return client;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientsService.delete(id);
  }
}
