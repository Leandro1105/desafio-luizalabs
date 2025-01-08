import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from 'src/common/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/Wishlist.dto';

const mockPrismaService = {
  client: {
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  wishlist: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
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

  describe('getWishlist', () => {
    it('Deve retornar a wishlist do cliente', async () => {
      const clientId = '1';
      const client = { id: '1', name: 'Teste', email: 'Cliente Teste' };
      const wishlistItems = [
        {
          product: {
            id: '101',
            title: 'Produto 1',
            image: 'image1.jpg',
            price: 100.0,
            reviewScore: 4.5,
          },
        },
        {
          product: {
            id: '102',
            title: 'Produto 2',
            image: 'image2.jpg',
            price: 200.0,
            reviewScore: 4.8,
          },
        },
      ];

      prisma.client.findUnique.mockResolvedValue(client);
      prisma.wishlist.findMany.mockResolvedValue(wishlistItems);

      const result = await service.getWishlist(clientId);

      expect(result).toEqual([
        {
          id: '101',
          title: 'Produto 1',
          image: 'image1.jpg',
          price: 100.0,
          reviewScore: 4.5,
          link: 'https://desafio-luizalabs-production.up.railway.app/products/101',
        },
        {
          id: '102',
          title: 'Produto 2',
          image: 'image2.jpg',
          price: 200.0,
          reviewScore: 4.8,
          link: 'https://desafio-luizalabs-production.up.railway.app/products/102',
        },
      ]);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: clientId },
      });
      expect(prisma.wishlist.findMany).toHaveBeenCalledWith({
        where: { clientId },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              image: true,
              price: true,
              reviewScore: true,
            },
          },
        },
      });
    });

    it('Deve retornar NotFoundException se o cliente não existir', async () => {
      const clientId = '1';
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.getWishlist(clientId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: clientId },
      });
      expect(prisma.wishlist.findMany).not.toHaveBeenCalled();
    });
  });
});
