const pool = require("../conexao");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJwt");

const validarToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado",
    });
  }

  try {
    const token = authorization.split(" ")[1];

    const { id } = jwt.verify(token, senhaJwt);

    const { rows, rowCount } = await pool.query(
      "select id, nome, email from usuarios where id = $1",
      [id]
    );

    if (rowCount < 1) {
      return res.status(401).json({
        mensagem:
          "Para acessar este recurso um token de autenticação válido deve ser enviado.",
      });
    }

    req.usuario = rows[0];

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

module.exports = validarToken;
