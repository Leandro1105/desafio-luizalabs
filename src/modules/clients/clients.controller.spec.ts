import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/Client.dto';
import { PaginationDto } from '../../common/dto/Pagination.dto';

let controller: ClientsController;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let service: ClientsService;

const mockClientService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getWishlist: jest.fn(),
};

describe('Teste do controller', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  describe('findAll', () => {
    it('Deve retornar todos os clientes com paginação', async () => {
      const paginationDto: PaginationDto = { page: 1 };
      const result = [
        { id: '1', name: 'Client 1' },
        { id: '2', name: 'Client 2' },
      ];
      mockClientService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(paginationDto)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('Deve retornar um cliente', async () => {
      const id = '1';
      const result = { id, name: 'Client 1' };
      mockClientService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('Deve criar um cliente', async () => {
      const createClientDto: CreateClientDto = {
        name: 'Novo cliente',
        email: 'teste@email.com',
      };
      const result = { id: '1', ...createClientDto };
      mockClientService.create.mockResolvedValue(result);

      expect(await controller.create(createClientDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('Deve atualizar um cliente', async () => {
      const id = '1';
      const updateClientDto: UpdateClientDto = { name: 'Teste' };
      const result = { id, ...updateClientDto };
      mockClientService.update.mockResolvedValue(result);

      expect(await controller.update(id, updateClientDto)).toBe(result);
    });
  });

  describe('delete', () => {
    it('Deve excluir um cliente', async () => {
      const id = '1';
      const result = { id };
      mockClientService.delete.mockResolvedValue(result);

      expect(await controller.delete(id)).toBe(result);
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
          link: 'http://localhost:3000/products/101',
        },
      ];
      mockClientService.getWishlist.mockResolvedValue(result);

      expect(await controller.getWishlist(id)).toBe(result);
      expect(mockClientService.getWishlist).toHaveBeenCalledWith(id);
    });
  });
});
