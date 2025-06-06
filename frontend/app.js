function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 10) {
    return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (valor.length > 5) {
    return valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (valor.length > 2) {
    return valor.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    return valor.replace(/(\d*)/, "($1");
  }
}

document.getElementById("telefone").addEventListener("input", (e) => {
  e.target.value = formatarTelefone(e.target.value);
});

document.getElementById("cep").addEventListener("blur", async (e) => {
  const cep = e.target.value.replace(/\D/g, "");
  if (cep.length === 8) {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (!data.erro) {
      document.getElementById("endereco").value = 
        data.logradouro + ", " + data.bairro + " - " + data.localidade + "/" + data.uf;
    }
  }
});

document.getElementById("numeroVenda").value = "VENDA-" + Date.now();

document.getElementById("addProduto").addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("produto");
  div.innerHTML = `
    <input type="text" placeholder="Nome do Produto" class="nomeProduto">
    <input type="number" placeholder="Valor (R$)" class="valorProduto">
  `;
  document.getElementById("produtos").appendChild(div);
});

function calcularTotal() {
  const valores = [...document.querySelectorAll(".valorProduto")].map(input => parseFloat(input.value) || 0);
  const desconto = parseFloat(document.getElementById("desconto").value) || 0;
  const total = valores.reduce((acc, val) => acc + val, 0) - desconto;
  document.getElementById("total").value = total.toFixed(2);
}

document.getElementById("produtos").addEventListener("input", calcularTotal);
document.getElementById("desconto").addEventListener("input", calcularTotal);

document.getElementById("clienteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const produtos = [...document.querySelectorAll(".produto")].map(div => {
    const nome = div.querySelector(".nomeProduto").value;
    const valor = div.querySelector(".valorProduto").value;
    return nome + ": R$" + valor;
  });

  const dados = Object.fromEntries(new FormData(form).entries());
  dados.produtos = produtos.join("\n");

  try {
    const res = await fetch("http://localhost:5000/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      document.getElementById("mensagem").textContent = "✅ Cliente salvo com sucesso!";
      form.reset();
      document.getElementById("produtos").innerHTML = `
        <div class="produto">
          <input type="text" placeholder="Nome do Produto" class="nomeProduto">
          <input type="number" placeholder="Valor (R$)" class="valorProduto">
        </div>`;
      document.getElementById("numeroVenda").value = "VENDA-" + Date.now();
    } else {
      document.getElementById("mensagem").textContent = "❌ Erro ao salvar cliente.";
    }
  } catch (err) {
    document.getElementById("mensagem").textContent = "⚠️ Erro de conexão com o servidor.";
  }
});
