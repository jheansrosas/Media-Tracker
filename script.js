// Seleciona os elementos do HTML
const formMidia = document.getElementById('form-midia');
const nomeInput = document.getElementById('nome-midia');
const tipoSelect = document.getElementById('tipo-midia');
const listaMidias = document.getElementById('lista-de-midia-aqui');

// Adiciona um "ouvinte de evento" ao formulário
formMidia.addEventListener('submit', function(event) {
    event.preventDefault(); //Impede que a página recarregue ao enviar o formulário

    const nome = nomeInput.value;
    const tipo = tipoSelect.value;

    // Se o nome não estiver vazio, cria o item na lista
    if (nome.trim() !== '') {
        adicionarMidia(nome, tipo);
        nomeInput.value = ''; // Limpa o input após adicionar
    }
});

// Função que cria e adiciona o item à lista
function adicionarMidia(nome, tipo) {
    const novoItem = document.createElement('li');
    novoItem.innerHTML = `
        <span>${nome} (${tipo})</span>
        <button class="btn-remover">Remover</button>
        `;
    listaMidias.appendChild(novoItem);
    salvarMidias();
}

// Adicione um " ouvinte de evento" à lista inteira para remover itens
listaMidias.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-remover')) {
        event.target.parentElement.remove();
        salvarMidias();
    }
});

function salvarMidias(){
    // Pega todos os itens da lista, converte para um array
    const midias = Array.from(listaMidias.children).map(item => {
        const nomeCompleto = item.querySelector('span').textContent;
        // Extrai o nome e o tipo do texto
        const [nome, tipo] = nomeCompleto.split(' (');
        return {
            nome: nome,
            tipo: tipo.replace(')', '')
        };
    });
    // Salva o array como uma string no localStorage
    localStorage.setItem('minhasMidias', JSON.stringify(midias));
}

function carregarMidias() {
    // Pega a string do localStorage
    const midiasSalvas = localStorage.getItem('minhasMidias');
    // Se houver dados, converta de volta para array e adiciona na lista
    if (midiasSalvas) {
        const midias = JSON.parse(midiasSalvas);
        midias.forEach(midia => {
            adicionarMidia(midia.nome, midia.tipo);
        });
    }
}

// Adicione a função de carregar no topo do seu arquivo JS
document.addEventListener('DOMContentLoaded', carregarMidias);

