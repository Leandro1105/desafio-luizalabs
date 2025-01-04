import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/common/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';

const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Teste da controller', () => {
  let controller: ProductsController;
  let service: typeof mockProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        PrismaService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(
      ProductsService,
    ) as unknown as typeof mockProductsService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('Deve retornar os produtos com paginação', async () => {
      const paginationDto: PaginationDto = { page: 1 };
      const products = [
        { id: '1', title: 'Produto 1', price: 100.0 },
        { id: '2', title: 'Produto 2', price: 200.0 },
      ];
      service.findAll.mockResolvedValue(products);

      const result = await controller.findAll(paginationDto);
      expect(result).toEqual(products);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('Deve retornar um produto', async () => {
      const product = { id: '1', title: 'Produto Teste', price: 100.0 };
      service.findOne.mockResolvedValue(product);

      const result = await controller.findOne('1');
      expect(result).toEqual(product);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('Deve criar um novo produto', async () => {
      const createProductDto: CreateProductDto = {
        title: 'Produto Teste',
        brand: 'Marca Teste',
        image: 'imagem.jpg',
        price: 100.0,
        reviewScore: 4.5,
      };
      const createdProduct = { id: '1', ...createProductDto };
      service.create.mockResolvedValue(createdProduct);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(createdProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('Deve atualizar um produto', async () => {
      const updateProductDto: UpdateProductDto = { price: 120.0 };
      const updatedProduct = { id: '1', title: 'Produto Teste', price: 120.0 };
      service.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('delete', () => {
    it('Deve excluir um produto', async () => {
      const product = { id: '1', title: 'Produto Teste', price: 100.0 };
      service.delete.mockResolvedValue(product);

      const result = await controller.delete('1');
      expect(result).toEqual(product);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
