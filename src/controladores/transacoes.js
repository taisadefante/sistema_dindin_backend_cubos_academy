const pool = require("../conexao");

const cadastrarTransacao = async (req, res, next) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  try {
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }

    const categoriaQuery = "SELECT * FROM categoria WHERE id = $1";
    const categoriaResult = await pool.query(categoriaQuery, [categoria_id]);

    if (categoriaResult.rows.length === 0) {
      return res.status(400).json({ mensagem: "Categoria não encontrada." });
    }

    const usuarioId = req.usuario.id;
    const transacaoQuery =
      "INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const transacaoResult = await pool.query(transacaoQuery, [
      descricao,
      valor,
      data,
      categoria_id,
      usuarioId,
      tipo,
    ]);

    return res.status(201).json(transacaoResult.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Erro interno do servidor");
  }
};

const listarTodasTransacoes = async (req, res, next) => {
  try {
    const { rows, rowCount } = await pool.query(
      `
            select * from transacoes where usuario_id = $1
            `,
      [req.usuario.id]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("ERROR");
  }
};

const listarTransacaoUsuario = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { rows, rowCount } = await pool.query(
      `
            select * from transacoes where usuario_id = $1 and id = $2
            `,
      [req.usuario.id, Number(id)]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("ERROR");
  }
};

const atualizarTransacao = async (req, res, next) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  const { id } = req.params;

  try {
    const { rows, rowCount } = await pool.query(
      `
            update transacoes
            set
            tipo = $1,
            descricao = $2,
            valor = $3,
            data = $4,
            categoria_id = $5,
            usuario_id = $6
            where
            id = $7 AND usuario_id = $8 returning *
            `,
      [
        tipo,
        descricao,
        valor,
        data,
        categoria_id,
        req.usuario.id,
        Number(id),
        req.usuario.id,
      ]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("ERROR");
  }
};

const excluirTransacao = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { rows, rowCount } = await pool.query(
      `
            delete from transacoes
            where
            id = $1 AND usuario_id = $2
            `,
      [Number(id), req.usuario.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    return res.status(204).json();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("ERROR");
  }
};

const extratoTransacao = async (req, res, next) => {
  try {
    const { rows, rowCount } = await pool.query(
      `
      SELECT valor, tipo FROM transacoes WHERE usuario_id = $1
      `,
      [req.usuario.id]
    );

    let entrada = rows
      .filter((el) => el.tipo === "entrada")
      .reduce((total, el) => total + el.valor, 0) || 0;

    let saida = rows
      .filter((el) => el.tipo === "saida")
      .reduce((total, el) => total + el.valor, 0) || 0;

    return res.status(200).json({
      entrada,
      saida,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("ERROR");
  }
};

module.exports = {
  cadastrarTransacao,
  listarTransacaoUsuario,
  listarTodasTransacoes,
  atualizarTransacao,
  excluirTransacao,
  extratoTransacao,
};
