const pool = require("../conexao");

const listarCategorias = async (req, res) => {
  try {
    const { rows } = await pool.query("select * from categoria");

    return res.json(rows);
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

module.exports = { listarCategorias };
