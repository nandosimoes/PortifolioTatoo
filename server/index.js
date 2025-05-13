require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/assets/images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Conexão com o MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tattoo_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Criar tabela se não existir
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initializeDatabase();

// Rotas
// Obter todas as imagens do portfólio
app.get('/api/portfolio', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// Adicionar nova imagem ao portfólio
app.post('/api/portfolio', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const { title, description } = req.body;
    const image_url = `/assets/images/${req.file.filename}`;

    const [result] = await pool.query(
      'INSERT INTO portfolio (image_url, title, description) VALUES (?, ?, ?)',
      [image_url, title, description]
    );

    res.status(201).json({
      id: result.insertId,
      image_url,
      title,
      description
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar imagem' });
  }
});

// Deletar imagem do portfólio
app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT image_url FROM portfolio WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    const imagePath = path.join(__dirname, '../public', rows[0].image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await pool.query('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});