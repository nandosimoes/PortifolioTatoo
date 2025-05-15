require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8080;

// Configurações
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/assets/images');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
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

// Conexão MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tattoo_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inicialização do Banco
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certificados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar usuário admin padrão se não existir
    const [users] = await connection.query('SELECT * FROM users WHERE username = ?', ['heloisa']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('Helo@535', 10);
      await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', ['heloisa', hashedPassword]);
      console.log('Usuário admin criado (senha: Helo@535)');
    }
    
    connection.release();
    console.log('Banco de dados inicializado');
  } catch (error) {
    console.error('Erro na inicialização do banco:', error);
  }
}

initializeDatabase();

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rotas Públicas
app.get('/api/portfolio', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar portfolio' });
  }
});

app.get('/api/certificados', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certificados ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar certificados' });
  }
});

// Rotas de Autenticação
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const match = await bcrypt.compare(password, users[0].password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { id: users[0].id, username: users[0].username },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );
    
    res.json({ token }); // Certifique-se de que está retornando { token }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor durante o login' });
  }
});

// Rotas Protegidas (Admin)
app.post('/api/portfolio', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    
    const { title, description } = req.body;
    const image_url = `/assets/images/${req.file.filename}`;
    
    const [result] = await pool.query(
      'INSERT INTO portfolio (image_url, title, description) VALUES (?, ?, ?)',
      [image_url, title, description]
    );
    
    res.status(201).json({ id: result.insertId, image_url, title, description });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
});

app.delete('/api/portfolio/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT image_url FROM portfolio WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item não encontrado' });
    
    const imagePath = path.join(__dirname, '../public', rows[0].image_url);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    await pool.query('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
});

app.post('/api/certificados', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    
    const { title, description } = req.body;
    const image_url = `/assets/images/${req.file.filename}`;
    
    const [result] = await pool.query(
      'INSERT INTO certificados (image_url, title, description) VALUES (?, ?, ?)',
      [image_url, title, description]
    );
    
    res.status(201).json({ id: result.insertId, image_url, title, description });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar certificado' });
  }
});

app.delete('/api/certificados/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT image_url FROM certificados WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Certificado não encontrado' });
    
    const imagePath = path.join(__dirname, '../public', rows[0].image_url);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    await pool.query('DELETE FROM certificados WHERE id = ?', [req.params.id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar certificado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});