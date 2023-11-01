const pool = require("../conexao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const senhaJwt = require("../senhaJwt");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await pool.query(
      "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *",
      [nome, email, senhaCriptografada]
    );

    // esconder senha
    const { senha: _, ...usuario } = novoUsuario.rows[0];

    return res.status(201).json(usuario);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "error" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Email ou senha invalida" });
    }

    const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, {
      expiresIn: "8h",
    });

    const { senha: _, ...novoUsuario } = usuario.rows[0];

    return res.status(200).json({ usuario: novoUsuario, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "ERROR" });
  }
};

const detalharUsuario = (req, res) => {
  return res.status(200).json(req.usuario);
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const atualizarUsuario = await pool.query(
      "update usuarios set nome= $1, email= $2, senha= $3 where id=$4 returning *",
      [nome, email, senhaCriptografada, req.usuario.id]
    );

    //não aparecer senha
    const { senha: _, ...usuario } = atualizarUsuario.rows[0];

    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "error" });
  }
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  atualizarUsuario,
};
