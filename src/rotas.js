const express = require("express");
const rotas = express();

const {
  cadastrarUsuario,
  login,
  atualizarUsuario,
  detalharUsuario,
} = require("./controladores/usuarios");

const { listarCategorias } = require("./controladores/categorias");

const {
  cadastrarTransacao,
  listarTransacao,
  atualizarTransacao,
  excluirTransacao,
  extratoTransacao,
  listarTransacaoUsuario,
  listarTodasTransacoes,
} = require("./controladores/transacoes");

const {
  validarNome,
  validarEmail,
  validarSenha,
  validarEmailCadastrado,
  validarEmailLogin,
} = require("./intermediarios/aut_usuario");

const {
  validarTodosOsCampos,
  validarTipo,
  categoriaNome,
} = require("./intermediarios/aut_transacao");

const validarAutorizacao = require("./intermediarios/autorizacao");

// usuarios
rotas.post(
  "/usuario",
  validarNome,
  validarEmail,
  validarSenha,
  validarEmailCadastrado,
  cadastrarUsuario
);

rotas.post("/login", validarEmail, validarSenha, validarEmailLogin, login);

rotas.use(validarAutorizacao);

rotas.get("/usuario", detalharUsuario);
rotas.put(
  "/usuario",
  validarNome,
  validarEmail,
  validarSenha,
  validarEmailCadastrado,
  atualizarUsuario
);

// categorias
rotas.get("/categoria", listarCategorias);

// transacoes
rotas.post(
  "/transacao",
  validarTodosOsCampos,
  validarTipo,
  categoriaNome,
  cadastrarTransacao
);
rotas.get("/transacao", listarTodasTransacoes);
rotas.get("/transacao/extrato", extratoTransacao);
rotas.get("/transacao/:id", listarTransacaoUsuario);
rotas.put(
  "/transacao/:id",
  validarTodosOsCampos,
  validarTipo,
  categoriaNome,
  atualizarTransacao
);
rotas.delete("/transacao/:id", excluirTransacao);

module.exports = rotas;
