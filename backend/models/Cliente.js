import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  endereco: String,
  cep: String,
  cpf: String,
  email: String,
  numeroVenda: String,
  produtos: String,
  desconto: String,
  total: String,
  formaPagamento: String,
  dataCadastro: { type: Date, default: Date.now }
});

export default mongoose.model('Cliente', clienteSchema);
