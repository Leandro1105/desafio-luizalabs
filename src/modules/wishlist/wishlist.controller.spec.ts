import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/Wishlist.dto';

const mockWishlistService = {
  create: jest.fn(),
  delete: jest.fn(),
  getWishlist: jest.fn(),
};

describe('Teste da controller', () => {
  let controller: WishlistController;
  let service: typeof mockWishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [{ provide: WishlistService, useValue: mockWishlistService }],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get<WishlistService>(
      WishlistService,
    ) as unknown as typeof mockWishlistService;
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
      service.create.mockResolvedValue({ id: '1', ...createWishlistDto });

      const result = await controller.create(createWishlistDto);
      expect(result).toEqual({ id: '1', ...createWishlistDto });
      expect(service.create).toHaveBeenCalledWith(createWishlistDto);
    });
  });

  describe('delete', () => {
    it('Deve excluir um produto dos favoritos', async () => {
      const clientId = '1';
      const productId = '101';
      service.delete.mockResolvedValue({ id: '1', clientId, productId });

      const result = await controller.delete(clientId, productId);
      expect(result).toEqual({ id: '1', clientId, productId });
      expect(service.delete).toHaveBeenCalledWith(clientId, productId);
    });
  });

  describe('getWishlist', () => {
    it('Deve retornar os favoritos de um cliente', async () => {
      const id = '1';
      const result = [
        {
          id: '101',
          title: 'Produto 1',
          price: 100,
          image: 'imagem1.jpg',
          reviewScore: 4.5,
          link: 'https://desafio-luizalabs-production.up.railway.app/products/101',
        },
      ];
      mockWishlistService.getWishlist.mockResolvedValue(result);

      expect(await controller.getWishlist(id)).toBe(result);
      expect(mockWishlistService.getWishlist).toHaveBeenCalledWith(id);
    });
  });
});
