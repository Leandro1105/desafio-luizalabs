import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/common/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  reviews: {
    findMany: jest.fn(),
  },
};

describe('Teste do service', () => {
  let service: ProductsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as typeof mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Deve criar um produto', async () => {
      const createProductDto = {
        title: 'Produto Teste',
        brand: 'Marca Teste',
        image: 'imagem-teste.jpg',
        price: 100.0,
        reviewScore: 4.5,
      };
      prisma.product.create.mockResolvedValue({ id: '1', ...createProductDto });

      const result = await service.create(createProductDto);
      expect(result).toEqual({ id: '1', ...createProductDto });
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });

  describe('findAll', () => {
    it('Deve retornar todos os produtos com paginação', async () => {
      const products = [
        { id: '1', title: 'Produto 1', price: 100.0 },
        { id: '2', title: 'Produto 2', price: 200.0 },
      ];
      prisma.product.findMany.mockResolvedValue(products);

      const result = await service.findAll({ page: 1 });
      expect(result).toEqual(products);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 4,
        include: { reviews: true },
      });
    });
  });

  describe('findOne', () => {
    it('Deve retornar um produto', async () => {
      const product = { id: '1', title: 'Produto Teste', price: 100.0 };
      prisma.product.findUnique.mockResolvedValue(product);

      const result = await service.findOne('1');
      expect(result).toEqual(product);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { reviews: true },
      });
    });

    it('Deve retornar NotFoundException se o produto não existir', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Deve atualizar um produto', async () => {
      const updateProductDto = { price: 120.0 };
      const updatedProduct = {
        id: '1',
        title: 'Produto Teste',
        price: 120.0,
      };
      prisma.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateProductDto,
      });
    });
  });

  describe('delete', () => {
    it('Deve excluir um produto', async () => {
      const product = { id: '1', title: 'Produto Teste', price: 100.0 };
      prisma.product.delete.mockResolvedValue(product);

      const result = await service.delete('1');
      expect(result).toEqual(product);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
