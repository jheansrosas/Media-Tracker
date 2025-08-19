// Seleciona os elementos do HTML
const formMidia = document.getElementById('form-midia');
const nomeInput = document.getElementById('nome-midia');
const tipoSelect = document.getElementById('tipo-midia');
const listaMidias = document.getElementById('lista-de-midia-aqui');

// Ouve o evento de envio do formulário
formMidia.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const nome = nomeInput.value.trim(); // .trim() remove espaços em branco extras
    const tipo = tipoSelect.value;

    if (nome !== '') {
        adicionarMidia(nome, tipo);
        nomeInput.value = ''; // Limpa o input
    }
});

// FUNÇÃO HELPER: Apenas cria o item <li>. NÃO salva no localStorage.
function criarItemMidia(nome, tipo, finalizado = false) {
    const novoItem = document.createElement('li');
    novoItem.innerHTML = `
        <span>${nome} (${tipo})</span>
        <button class="btn-finalizado">Finalizado</button>
        <button class="btn-remover">Remover</button>
    `;
    if (finalizado) {
        novoItem.classList.add('finalizado');
    }
    return novoItem;
}

// FUNÇÃO PRINCIPAL: Adiciona o item na lista E salva no localStorage
function adicionarMidia(nome, tipo) {
    const novoItem = criarItemMidia(nome, tipo);
    listaMidias.appendChild(novoItem);
    salvarMidias(); // Salva a lista completa
}

// Ouve cliques na lista para remover ou finalizar itens
listaMidias.addEventListener('click', function(event) {
    const item = event.target.closest('li');
    if (!item) return; // Se o clique não foi em um <li>, sai da função

    if (event.target.classList.contains('btn-remover')) {
        item.remove();
        salvarMidias();
    } else if (event.target.classList.contains('btn-finalizado')) {
        item.classList.toggle('finalizado');
        salvarMidias();
    }
});

// Salva a lista completa no localStorage
function salvarMidias() {
    const midias = Array.from(listaMidias.children).map(item => {
        const nomeCompleto = item.querySelector('span').textContent;
        const [nome, tipo] = nomeCompleto.split(' (');
        return {
            nome: nome.trim(),
            tipo: tipo.replace(')', '').trim(),
            finalizado: item.classList.contains('finalizado')
        };
    });
    localStorage.setItem('minhasMidias', JSON.stringify(midias));
}

// Carrega os itens salvos quando a página é carregada
function carregarMidias() {
    const midiasSalvas = localStorage.getItem('minhasMidias');
    if (midiasSalvas) {
        const midias = JSON.parse(midiasSalvas);
        midias.forEach(midia => {
            const novoItem = criarItemMidia(midia.nome, midia.tipo, midia.finalizado);
            listaMidias.appendChild(novoItem);
        });
    }
}

// Carrega os dados salvos quando a página termina de carregar
document.addEventListener('DOMContentLoaded', carregarMidias);
