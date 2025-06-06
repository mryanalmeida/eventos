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
    } else {
      document.getElementById('mensagem').textContent = '❌ Erro ao salvar cliente.';
    }
  } catch (err) {
    document.getElementById('mensagem').textContent = '⚠️ Erro de conexão com o servidor.';
  }
});
