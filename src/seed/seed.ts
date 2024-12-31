import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Usuário
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin',
      role: 'ADMIN',
    },
  });

  //Clientes
  const clientes = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Leandro Vieira',
        email: 'leandro.vieira@luizalabs.com',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Leandro Andrade',
        email: 'leandro.andrade@luizalabs.com',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Ana Santos',
        email: 'ana.santos@example.com',
      },
    }),
  ]);

  console.log('Clientes criados:', clientes);

  // Seed para produtos
  const produtos = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Smartphone S24 Ultra',
        brand: 'Samsung',
        image: 'https://example.com/smartphone.jpg',
        price: 2999.99,
        reviewScore: 4.8,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Fone de Ouvido Samsung',
        brand: 'Samsung',
        image: 'https://example.com/fone.jpg',
        price: 499.99,
        reviewScore: 4.7,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Notebook Gamer Acer',
        brand: 'Acer',
        image: 'https://example.com/notebook.jpg',
        price: 5999.99,
        reviewScore: 4.5,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Relógio Inteligente Apple',
        brand: 'Apple',
        image: 'https://example.com/relogio.jpg',
        price: 999.99,
        reviewScore: 4.3,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Câmera Fotográfica Canon',
        brand: 'Canon',
        image: 'https://example.com/camera.jpg',
        price: 2499.99,
        reviewScore: 4.6,
      },
    }),
  ]);

  console.log('Produtos criados:', produtos);

  // Seed para wishlists
  const wishlists = await Promise.all([
    prisma.wishlist.create({
      data: {
        clientId: clientes[0].id,
        productId: produtos[0].id,
      },
    }),
    prisma.wishlist.create({
      data: {
        clientId: clientes[0].id,
        productId: produtos[1].id,
      },
    }),
    prisma.wishlist.create({
      data: {
        clientId: clientes[1].id,
        productId: produtos[2].id,
      },
    }),
    prisma.wishlist.create({
      data: {
        clientId: clientes[1].id,
        productId: produtos[3].id,
      },
    }),
    prisma.wishlist.create({
      data: {
        clientId: clientes[2].id,
        productId: produtos[4].id,
      },
    }),
    prisma.wishlist.create({
      data: {
        clientId: clientes[2].id,
        productId: produtos[0].id,
      },
    }),
  ]);

  console.log('Wishlists criadas:', wishlists);

  // Seed para reviews
  const reviews = await Promise.all([
    prisma.reviews.create({
      data: {
        clientId: clientes[0].id,
        productId: produtos[0].id,
        title: 'Ótimo produto!',
        score: 5,
        review: 'O smartphone é incrível, superou minhas expectativas.',
      },
    }),
    prisma.reviews.create({
      data: {
        clientId: clientes[1].id,
        productId: produtos[1].id,
        title: 'Som maravilhoso!',
        score: 4.5,
        review:
          'Os fones têm uma qualidade de som excelente, mas poderiam ser mais confortáveis.',
      },
    }),
    prisma.reviews.create({
      data: {
        clientId: clientes[2].id,
        productId: produtos[2].id,
        title: 'Notebook excelente!',
        score: 4.7,
        review: 'Perfeito para jogos e tarefas pesadas. Recomendo!',
      },
    }),
  ]);

  console.log('Reviews criados:', reviews);
}

main()
  .then(() => {
    console.log('Seeding concluído.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Erro ao realizar o seeding:', e);
    return prisma.$disconnect();
  });
