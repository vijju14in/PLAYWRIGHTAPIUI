import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database
interface User {
  id: number;
  username: string;
  email: string;
  region: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  region: string;
}

let users: User[] = [
  { id: 1, username: 'john_us', email: 'john@example.com', region: 'us' },
  { id: 2, username: 'jane_eu', email: 'jane@example.com', region: 'eu' },
  { id: 3, username: 'bob_asia', email: 'bob@example.com', region: 'asia' }
];

let products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, currency: 'USD', region: 'us' },
  { id: 2, name: 'Mouse', price: 25, currency: 'USD', region: 'us' },
  { id: 3, name: 'Laptop', price: 899, currency: 'EUR', region: 'eu' },
  { id: 4, name: 'Mouse', price: 22, currency: 'EUR', region: 'eu' },
  { id: 5, name: 'Laptop', price: 110000, currency: 'JPY', region: 'asia' },
  { id: 6, name: 'Mouse', price: 2800, currency: 'JPY', region: 'asia' }
];

// API Routes

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Users API
app.get('/api/users', (req: Request, res: Response) => {
  const region = req.query.region as string;
  const filteredUsers = region ? users.filter(u => u.region === region) : users;
  res.json({ users: filteredUsers, count: filteredUsers.length });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users', (req: Request, res: Response) => {
  const newUser: User = {
    id: users.length + 1,
    username: req.body.username,
    email: req.body.email,
    region: req.body.region
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    res.json({ message: 'User deleted', user: deletedUser[0] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  const region = req.query.region as string;
  const filteredProducts = region ? products.filter(p => p.region === region) : products;
  res.json({ products: filteredProducts, count: filteredProducts.length });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    currency: req.body.currency,
    region: req.body.region
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Login API
app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (password === 'password123') {
    const user = users.find(u => u.username === username);
    if (user) {
      res.json({
        success: true,
        token: 'mock-jwt-token-' + user.id,
        user: user
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// UI Routes
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/products', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get('/users', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
