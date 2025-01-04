import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from 'src/common/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/Wishlist.dto';

const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
  },
  wishlist: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

describe('Teste do service', () => {
  let service: WishlistService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as typeof mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Deve adicionar um produto aos favoritos', async () => {
      const createWishlistDto: CreateWishlistDto = {
        clientId: '1',
        productId: '101',
      };
      const product = { id: '101', title: 'Produto Teste', price: 100.0 };
      prisma.product.findUnique.mockResolvedValue(product);
      prisma.wishlist.findFirst.mockResolvedValue(null);
      prisma.wishlist.create.mockResolvedValue({
        id: '1',
        ...createWishlistDto,
      });

      const result = await service.create(createWishlistDto);
      expect(result).toEqual({ id: '1', ...createWishlistDto });
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: '101' },
      });
      expect(prisma.wishlist.findFirst).toHaveBeenCalledWith({
        where: { clientId: '1', productId: '101' },
      });
      expect(prisma.wishlist.create).toHaveBeenCalledWith({
        data: createWishlistDto,
      });
    });

    it('Deve retornar NotFoundException se o produto não existir', async () => {
      const createWishlistDto: CreateWishlistDto = {
        clientId: '1',
        productId: '101',
      };
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.create(createWishlistDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Deve retornar ConflictException se o produto já estiver favoritado', async () => {
      const createWishlistDto: CreateWishlistDto = {
        clientId: '1',
        productId: '101',
      };
      const existingWishlistItem = { id: '1', ...createWishlistDto };
      prisma.product.findUnique.mockResolvedValue({
        id: '101',
        title: 'Produto Teste',
        price: 100.0,
      });
      prisma.wishlist.findFirst.mockResolvedValue(existingWishlistItem);

      await expect(service.create(createWishlistDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('Deve excluir um produto dos favoritos', async () => {
      const clientId = '1';
      const productId = '101';
      const deletedItem = { id: '1', clientId, productId };
      prisma.wishlist.delete.mockResolvedValue(deletedItem);

      const result = await service.delete(clientId, productId);
      expect(result).toEqual(deletedItem);
      expect(prisma.wishlist.delete).toHaveBeenCalledWith({
        where: { clientId_productId: { clientId, productId } },
      });
    });
  });
});
