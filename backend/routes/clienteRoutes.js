import express from 'express';
import Cliente from '../models/Cliente.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ dataCadastro: -1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
