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
import { ProductsService } from './products.service';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';

@Controller('')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  @Post('')
  async create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    const product = await this.productsService.update(id, data);

    return product;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
