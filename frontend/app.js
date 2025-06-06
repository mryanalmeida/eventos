// Formatar telefone automaticamente
document.querySelector('input[name="telefone"]').addEventListener('input', function (e) {
  let valor = e.target.value.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length <= 10) {
    valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
  e.target.value = valor.trim();
});

// Preencher endereço pelo CEP
document.querySelector('input[name="cep"]').addEventListener('blur', async function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length === 8) {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await res.json();
    if (!dados.erro) {
      document.querySelector('input[name="endereco"]').value = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
    }
  }
});

// Preencher número da venda automaticamente
async function preencherNumeroVenda() {
  try {
    const res = await fetch('http://localhost:5000/api/clientes');
    const clientes = await res.json();
    const proximoNumero = clientes.length + 1;
    document.querySelector('input[name="numeroVenda"]').value = proximoNumero;
  } catch (err) {
    console.error('Erro ao buscar número de venda:', err);
  }
}

// Calcular total com desconto
function calcularTotal() {
  const produtoInput = document.querySelector('input[name="produtos"]').value;
  const descontoInput = document.querySelector('input[name="desconto"]').value;
  const totalInput = document.querySelector('input[name="total"]');

  const valorMatch = produtoInput.match(/(\d+,\d{2}|\d+)/);
  if (!valorMatch) return;
  let valor = parseFloat(valorMatch[0].replace(',', '.'));

  if (descontoInput.includes('%')) {
    const porcentagem = parseFloat(descontoInput.replace('%', '').replace(',', '.'));
    if (!isNaN(porcentagem)) {
      valor -= valor * (porcentagem / 100);
    }
  } else {
    const desconto = parseFloat(descontoInput.replace(',', '.'));
    if (!isNaN(desconto)) {
      valor -= desconto;
    }
  }

  totalInput.value = valor.toFixed(2).replace('.', ',');
}

document.querySelector('input[name="produtos"]').addEventListener('input', calcularTotal);
document.querySelector('input[name="desconto"]').addEventListener('input', calcularTotal);

document.addEventListener('DOMContentLoaded', preencherNumeroVenda);

document.getElementById('clienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const dados = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('http://localhost:5000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (res.ok) {
      document.getElementById('mensagem').textContent = '✅ Cliente salvo com sucesso!';
      form.reset();
      preencherNumeroVenda();
    } else {
      document.getElementById('mensagem').textContent = '❌ Erro ao salvar cliente.';
    }
  } catch (err) {
    document.getElementById('mensagem').textContent = '⚠️ Erro de conexão com o servidor.';
  }
});
