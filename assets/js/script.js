// Selecionado elementos do DOM
const form = document.getElementById("media-form");
const inputName = document.getElementById("media-name");
const selectType = document.getElementById("media-type");
const mediaList = document.getElementById("media-list");
const progress = document.getElementById("progress");
const status = document.getElementById("status");
const filter = document.getElementById("filter");

// Escutando o envio do formulário
form.addEventListener("submit", function(event){
    event.preventDefault(); // Impede recarregamento da página

    const name = inputName.value.trim();
    const type = selectType.value;

    if(name === "") return;

    console.log("Nova mídia:", name, type);

    // Criar elemento da lista
    const li = document.createElement("li");

    const statusMap = {
        planned: "Planejado",
        watching: "Assistindo",
        completed: "Finalizado"
    };

    li.innerHTML = `
        <strong>${name}</strong> (${type})
        <br>
        <span>Status: ${statusMap[status.value]}</span>
        <br>
        <span class="progress-text">Progresso: ${progress.value || "Não iniciado"}</span>
        <br>
        <button class="edit-btn">Editar</button>
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

    if(event.target.classList.contains("edit-btn")) {
        
        const li = event.target.parentElement;
        const progressSpan = li.querySelector(".progress-text");
        const statusSpan = li.querySelector("span");

        const text = li.querySelector("strong").nextSibling.textContent;

        let mudou = false;

        if(text.includes("Filme")) {

            const novoStatus = prompt("Digite: Planejado ou Finalizado");

            if(novoStatus !== null) {
                statusSpan.textContent = "Status: " + novoStatus;
                mudou = true;
            }

        } else {

            const novoProgresso = prompt("Atualize o progresso:");

            if(novoProgresso !== null) {
                progressSpan.textContent = "Progresso: " + novoProgresso;
                mudou = true;
            }

        }

        if(mudou) {
            saveMedia();
        }

    }

});

filter.addEventListener("change", function() {
    const selected = filter.value;
    const items = mediaList.querySelectorAll("li");

    const statusMap = {
        planned: "Planejado",
        watching: "Assistindo",
        completed: "Finalizado"
    };

    items.forEach(function(item) {
        const statusText = item.querySelector("span").textContent.replace("Status:", "").trim();

        if(selected === "all" || statusText === statusMap[selected]){
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});

function saveMedia() {

    const items = [];
    const listItems = mediaList.querySelectorAll("li");
    listItems.forEach(function(Item) {
        const text = Item.textContent.replace("Remover","").trim();
        const parts = text.split("(");

        const name = parts[0].trim();
        const type = parts[1].replace(")","").trim();

        const progressText = Item.querySelector(".progress-text").textContent.replace("Progresso:", "").trim();
        const statusText = Item.querySelector("span").textContent.replace("Status:", "").trim();

        items.push({
            name: name,
            type: type,
            status: statusText,
            progress: progressText
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
            <span>Status: ${item.status || "Planejado"}</span>
            <br>
            <span class="progress-text">Progresso: ${item.progress || "Não iniciado"}</span>
            <br>
            <button class="edit-btn">Editar</button>
            <button class="remove-btn">Remover</button>
        `;

        mediaList.appendChild(li);

    });
}

loadMedia();