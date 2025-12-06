const navWrite = document.getElementById('nav-write');
const navRead = document.getElementById('nav-read');

const panelCompose = document.getElementById('panel-compose');
const panelLibrary = document.getElementById('panel-library');

const fieldOrigin = document.getElementById('field-origin');
const fieldBody = document.getElementById('field-body');

const cmdStore = document.getElementById('cmd-store');
const cmdWipe = document.getElementById('cmd-wipe');
const vaultGrid = document.getElementById('vault-grid');


let vaultData = JSON.parse(localStorage.getItem("vault_items")) || [];


navWrite.addEventListener('click', function() {

  panelCompose.classList.remove('hidden');
    panelLibrary.classList.add('hidden');
    
    navWrite.classList.add('active-tab');
    navRead.classList.remove('active-tab');
});

navRead.addEventListener('click', function() {

  panelCompose.classList.add('hidden');
    panelLibrary.classList.remove('hidden');

    navRead.classList.add('active-tab');
    navWrite.classList.remove('active-tab');

    renderVault();
});

cmdStore.addEventListener('click', saveEntry);

cmdWipe.addEventListener('click', wipeVault);

vaultGrid.addEventListener('click', function(event) {
    const target = event.target;
    const index = target.getAttribute('data-id');

    if (target.classList.contains('tool-copy')) {
        copyEntry(index);
    } 
    else if (target.classList.contains('tool-edit')) {
        editEntry(index);
    } 
    else if (target.classList.contains('tool-del')) {
        deleteEntry(index);
    }
});


function saveEntry() {
    const origin = fieldOrigin.value;
    const body = fieldBody.value;

    if(body.trim() === "") {
        alert("The vault cannot accept empty silence.");
        return;
    }

    const newEntry = {
        author: origin.trim() === "" ? "Anonymous" : origin,
        text: body
    };

    vaultData.push(newEntry);
    updateStorage();

    fieldOrigin.value = "";
    fieldBody.value = "";
    alert("Entry secured in Vault.");
}

function renderVault() {
    vaultGrid.innerHTML = "";

    vaultData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "quote-card";

        card.innerHTML = `
            <div class="card-origin">${item.author}</div>
            <div class="card-body">"${item.text}"</div>
            <div class="card-actions">
                <button class="tool-btn tool-copy" data-id="${index}">Copy</button>
                <button class="tool-btn tool-edit" data-id="${index}">Edit</button>
                <button class="tool-btn tool-del" data-id="${index}">Delete</button>
            </div>
        `;

        vaultGrid.appendChild(card);
    });
}

function deleteEntry(index) {
    vaultData.splice(index, 1);
    updateStorage();
    renderVault();
}

function editEntry(index) {
    const currentItem = vaultData[index];
    const newText = prompt("Refine your thought:", currentItem.text);
    
    if(newText !== null && newText.trim() !== "") {
        vaultData[index].text = newText;
        updateStorage();
        renderVault();
    }
}

function copyEntry(index) {
    const text = vaultData[index].text;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
}

function wipeVault() {
    if (confirm("Are you sure you want to incinerate all records?")) {
        vaultData = [];
        updateStorage();
        renderVault();
    }
}

function updateStorage() {
    localStorage.setItem("vault_items", JSON.stringify(vaultData));
}

navWrite.click();
