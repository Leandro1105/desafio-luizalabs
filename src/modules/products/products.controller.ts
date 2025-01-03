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
import { ProductsService } from './products.service';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post('')
  async create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    const product = await this.productsService.update(id, data);

    return product;
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
