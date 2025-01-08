import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/Client.dto';
import { PaginationDto } from '../../common/dto/Pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles(Role.Admin)
  @Get('')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post('')
  async create(@Body() data: CreateClientDto) {
    return this.clientsService.create(data);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateClientDto) {
    const client = await this.clientsService.update(id, data);

    return client;
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientsService.delete(id);
  }
}
