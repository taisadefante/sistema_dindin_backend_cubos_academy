const pool = require("../conexao");


const validarTodosOsCampos = async (req, res, next) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;

  if (!tipo || !descricao || !valor || !data || !categoria_id) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
  }

  next();
};

const validarTipo = async (req, res, next) => {
  const { tipo } = req.body;

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({ mensagem: "O tipo informado é invalido." });
  }

  next();
};

const categoriaNome = async (req, res, next) => {
  const { categoria_id } = req.body;

  const categoria = await pool.query(
    "select descricao from categoria where id=$1",
    [categoria_id]
  );

  if (categoria.rowCount === 0) {
    return res.status(400).json({ message: "Essa categoria não existe." });
  }

  req.categoria = categoria.rows[0].descricao;

  next();
};

module.exports = {
  validarTodosOsCampos,
  validarTipo,
  categoriaNome,
};
