## Desafio técnico - Luizalabs
Olá, tudo bem?

Esse é o repositório da API que desenvolvi para o desafio de wishlist da squad de Catalogação do Luizalabs!

Utilizei as seguintes tecnologias para o desenvolvimento: NestJs (framework do nodejs), Prisma e PostgreSQL.

Abaixo está a lista de comandos para que você possa testar o projeto.

Quaisquer dúvidas estou a disposição.

Atenciosamente, Leandro Andrade Vieira

Link da documentação no postman: [Documentação](https://documenter.getpostman.com/view/35374986/2sAYJ9AJES)

## Deploy da API
A API está no ar por meio do site railway. Os endpoints podem ser testados pela URL https://desafio-luizalabs-production.up.railway.app/

## Para testar localmente
## Arquivo env
Crie um arquivo .env na raiz do seu projeto, e insira as seguintes variáveis:

DATABASE_URL="postgresql://postgres:123456@localhost:5432/desafio?schema=public"

JWT_SECRET: 'changeme'


## Instalação de dependências

```bash
$ npm install
```

## Migração do banco de dados + seed

```bash
$ npx prisma generate

$ npx prisma migrate dev

$ npm run seed
```

## Testar o projeto

```bash
$ npm run start:dev

```

## Rodar testes

```bash
$ npm run test

```
