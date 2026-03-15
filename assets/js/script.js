// Selecionado elementos do DOM
const form = document.getElementById("media-form");
const inputName = document.getElementById("media-name");
const selectType = document.getElementById("media-type");
const mediaList = document.getElementById("media-list");
const progress = document.getElementById("progress");

// Escutando o envio do formulário
form.addEventListener("submit", function(event){
    event.preventDefault(); // Impede recarregamento da página

    const name = inputName.value.trim();
    const type = selectType.value;

    if(name === "") return;

    console.log("Nova mídia:", name, type);

    // Criar elemento da lista
    const li = document.createElement("li");

    li.innerHTML = `
        ${name} (${type})
        <button class="remove-btn">Remover</button>
    `;

    // Adicionar na lista
    mediaList.appendChild(li);

    saveMedia();

    form.reset();

    progress.value = "";
});

mediaList.addEventListener("click", function(event) {
    
    if(event.target.classList.contains("remove-btn")) {
        const li = event.target.parentElement;
        li.remove();

        saveMedia();
    }

});

function saveMedia() {

    const items = [];
    const listItems = mediaList.querySelectorAll("li");
    listItems.forEach(function(Item) {
        const text = Item.textContent.replace("Remover","").trim();
        const parts = text.split("(");

        const name = parts[0].trim();
        const type = parts[1].replace(")","").trim();

        items.push({
            name: name,
            type: type,
            progress: progress.value
        });
    });

    localStorage.setItem("mediaList", JSON.stringify(items));

}

function loadMedia() {
    
    const savedItems = localStorage.getItem("mediaList");
    
    if(!savedItems) return;

    const items = JSON.parse(savedItems);

    items.forEach(function(item) {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${item.name}</strong> (${item.type})
            <br>
            <span>Progresso: ${item.progress || "Não iniciado"}</span>
            <br>
            <button class="remove-btn">Remover</button>
        `;

        mediaList.appendChild(li);

    });
}

loadMedia();