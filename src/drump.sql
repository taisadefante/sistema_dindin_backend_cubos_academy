create database dindin;

create table usuarios(
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null
);

create table categoria(
    id serial primary key,
    descricao text
);

 create table transacoes(
    id serial primary key,
    descricao text,
    valor text,
    data date,
    categoria_id integer not null references categoria(id),
    usuario_id integer not null references usuarios(id),
    tipo text
 );



INSERT INTO categoria (descricao) VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');