const pool = require("../conexao");

const validarNome = (req, res, next) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ message: "O nome é obrigatorio" });
  }

  next();
};

const validarEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "O email é obrigatorio" });
  }

  next();
};

const validarSenha = async (req, res, next) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ message: "A senha é obrigatoria" });
  }

  next();
};

const validarEmailCadastrado = async (req, res, next) => {
  const { email } = req.body;

  const { rowCount } = await pool.query(
    "select email from usuarios where email = $1",
    [email]
  );

  if (rowCount > 0) {
    return res.status(400).json({
      message: "Já existe usuário cadastrado com o e-mail informado.",
    });
  }

  next();
};

const validarEmailLogin = async (req, res, next) => {
  const { email } = req.body;

  const { rowCount } = await pool.query(
    "select email from usuarios where email = $1",
    [email]
  );

  if (rowCount === 0) {
    return res.status(400).json({ message: "Esse e-mail não existe." });
  }

  next();
};

module.exports = {
  validarNome,
  validarEmail,
  validarSenha,
  validarEmailCadastrado,
  validarEmailLogin,
};
