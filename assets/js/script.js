// Selecionado elementos do DOM
const form = document.getElementById("media-form");
const inputName = document.getElementById("media-name");
const selectType = document.getElementById("media-type");
const mediaList = document.getElementById("media-list");

const status = document.getElementById("status");
const filter = document.getElementById("filter");
const seriesFields = document.getElementById("series-fields");
const chapterFields = document.getElementById("chapter-fields");
const bookFields = document.getElementById("book-fields");
const seasonInput = document.getElementById("season");
const episodeInput = document.getElementById("episode");
const chapterInput = document.getElementById("chapter");
const pageInput = document.getElementById("page");

function hideDynamicFields() {
    seriesFields.style.display = "none";
    chapterFields.style.display = "none";
    bookFields.style.display = "none";
}

function updateStatusOptions() {
    const type = selectType.value;

    status.innerHTML = "";

    const plannedOption = document.createElement("option");
    plannedOption.value = "planned";
    plannedOption.textContent = "Planejado";

    const completedOption = document.createElement("option");
    completedOption.value = "completed";
    completedOption.textContent = "Finalizado";

    status.appendChild(plannedOption);

    if(type !== "Filme") {
        const watchingOption = document.createElement("option");
        watchingOption.value = "watching";
        if(type === "Livro" || type === "Mangá") {
            watchingOption.textContent = "Lendo";
        } else {
            watchingOption.textContent = "Assistindo";
        }
        
        status.appendChild(watchingOption);
    }

    status.appendChild(completedOption);
}

function updateFields(){
    hideDynamicFields();
    updateStatusOptions();

    const type = selectType.value;

    if(type === "Série" || type === "Anime") {
        seriesFields.style.display = "block";
    }

    if(type === "Mangá") {
        chapterFields.style.display = "block";
    }

    if(type === "Livro") {
        bookFields.style.display = "block";
    }
}

selectType.addEventListener("change", updateFields);

updateFields();

function createMediaCard(name, type, statusText, progressText) {
    const li = document.createElement("li");

    let progressHTML = "";

    if(type !== "Filme")  {
        progressHTML = `<span class="progress-text">Progresso: ${progressText}</span>`;
    }

    li.innerHTML = `
        <div class="card-header">
            <strong>${name}</strong> (${type})
        </div>
        <div class="info">
            <span>Status: ${statusText}</span>
            ${progressHTML}
        </div>
        <div class="buttons">
            <button class="edit-btn">Editar</button>
            <button class="remove-btn">Remover</button>
        </div>
    `;

    return li;
}

// Escutando o envio do formulário
form.addEventListener("submit", function(event){
    event.preventDefault(); // Impede recarregamento da página

    const name = inputName.value.trim();
    const type = selectType.value;
    const season = seasonInput.value;
    const episode = episodeInput.value;
    const chapter = chapterInput.value;
    const page = pageInput.value;

    let progressText = "Não iniciado";

    if(type === "Série" || type === "Anime") {
        progressText = `T${season || 1} EP${episode || 1}`;
    }

    if(type === "Mangá") {
        progressText = `Capítulo ${chapter || 1}`;
    }

    if(type === "Livro") {
        progressText = `Página ${page || 1}`;
    }

    if(name === "") return;

    console.log("Nova mídia:", name, type);

    const statusText =status.options[status.selectedIndex].textContent;
    // Criar elemento da lista
    const li = createMediaCard(
        name,
        type,
        statusText,
        progressText
    );

    // Adicionar na lista
    mediaList.appendChild(li);

    saveMedia();

    form.reset();
    updateFields();

});

mediaList.addEventListener("click", function(event) {
    
    if(event.target.classList.contains("remove-btn")) {
        const li = event.target.closest("li");
        li.remove();

        saveMedia();
    }

    if(event.target.classList.contains("edit-btn")) {
        
        const li = event.target.closest("li");
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
        const strongText = Item.querySelector("strong").textContent;
        const typeText = Item.querySelector("strong").nextSibling.textContent;

        const name = strongText.trim();
        const type = typeText.replace("(", "").replace(")", "").trim();

        const progressElement = Item.querySelector(".progress-text");

        const progressText = progressElement
            ? progressElement.textContent.replace("Progresso:", "").trim()
            : "";
            
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
        const li = createMediaCard(
            item.name,
            item.type,
            item.status || "Planejado",
            item.progress || "Não iniciado"
        );

        mediaList.appendChild(li);

    });
}

loadMedia();