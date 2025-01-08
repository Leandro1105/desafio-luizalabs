import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from 'src/common/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  client: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  wishlist: {
    findMany: jest.fn(),
  },
};

let service: ClientsService;
let prisma: typeof mockPrismaService;

describe('Teste do service', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as typeof mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Deve criar um cliente', async () => {
      const createClientDto = { name: 'Teste', email: 'teste@email.com' };
      prisma.client.findUnique.mockResolvedValue(null);
      prisma.client.create.mockResolvedValue({ id: '1', ...createClientDto });

      const result = await service.create(createClientDto);
      expect(result).toEqual({ id: '1', ...createClientDto });
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { email: 'teste@email.com' },
      });
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: createClientDto,
      });
    });

    it('Deve retornar ConflictException se o e-mail já estiver em uso', async () => {
      const createClientDto = { name: 'Teste', email: 'teste@email.com' };
      prisma.client.findUnique.mockResolvedValue({
        id: '1',
        ...createClientDto,
      });

      await expect(service.create(createClientDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('Deve retornar todos os clientes com paginação', async () => {
      const clients = [
        { id: '1', name: 'Teste1', email: 'teste1@email.com' },
        { id: '2', name: 'Teste2', email: 'teste2@email.com' },
      ];
      prisma.client.findMany.mockResolvedValue(clients);

      const result = await service.findAll({ page: 1 });
      expect(result).toEqual(clients);
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 4,
        select: { id: true, name: true, email: true },
      });
    });
  });

  describe('findOne', () => {
    it('Deve retornar um cliente', async () => {
      const client = { id: '1', name: 'Teste', email: 'teste@email.com' };
      prisma.client.findUnique.mockResolvedValue(client);

      const result = await service.findOne('1');
      expect(result).toEqual(client);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('Deve retprmar NotFoundException se o cliente não existir', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Deve atualizar um cliente', async () => {
      const updateClientDto = { name: 'Teste' };
      const updatedClient = {
        id: '1',
        name: 'Teste',
        email: 'teste@email.com',
      };
      prisma.client.update.mockResolvedValue(updatedClient);

      const result = await service.update('1', updateClientDto);
      expect(result).toEqual(updatedClient);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateClientDto,
      });
    });
  });

  describe('delete', () => {
    it('Deve excluir um cliente', async () => {
      const client = { id: '1', name: 'Teste', email: 'teste@email.com' };
      prisma.client.delete.mockResolvedValue(client);

      const result = await service.delete('1');
      expect(result).toEqual(client);
      expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
