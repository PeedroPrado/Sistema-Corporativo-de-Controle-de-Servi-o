const API = "/api/ordens";

const form = document.getElementById("form");
const lista = document.getElementById("lista");

const modalBG = document.getElementById("modal");
const modalStatus = document.getElementById("modal-status");
const modalResp = document.getElementById("modal-responsavel");
const btnSalvar = document.getElementById("btn-salvar");
const btnFechar = document.getElementById("btn-fechar");

let ordemAtualId = null;


// ------------------- CRIAR ORDEM --------------------
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form));

    dados.valorServico = Number(dados.valorServico);

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    form.reset();
    carregarOrdens();
});


// ------------------- LISTAR ORDENS --------------------
async function carregarOrdens() {

    const res = await fetch(API);
    const ordens = await res.json();

    lista.innerHTML = "";

    ordens.forEach(o => {
        const el = document.createElement("div");
        el.className = "card";

        el.innerHTML = `
            <strong>${o.titulo}</strong>
            <p>${o.descricao}</p>
            <p>Status: ${o.status}</p>
            <p>Prioridade: ${o.prioridade}</p>
            <p>Setor: ${o.setorSolicitante}</p>
            <p>Valor: R$ ${Number(o.valorServico).toFixed(2)}</p>

            <button class="btn-edit" data-id="${o._id}">Editar</button>
            <button class="btn-delete" data-id="${o._id}">Excluir</button>
        `;

        lista.appendChild(el);
    });

    ativarBotoes();
}

carregarOrdens();


// ------------------- BOTÕES EDITAR / EXCLUIR --------------------
function ativarBotoes() {

    // Excluir
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("Excluir esta ordem? (somente concluída ou cancelada)")) return;

            const r = await fetch(`${API}/${id}`, { method: "DELETE" });
            const json = await r.json();

            if (!r.ok) alert(json.message);
            carregarOrdens();
        };
    });

    // Editar → abre modal
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.onclick = async () => {
            ordemAtualId = btn.dataset.id;
            abrirModal();
        };
    });
}


// ------------------- MODAL --------------------
function abrirModal() {
    modalBG.classList.remove("hidden");
}

function fecharModal() {
    modalBG.classList.add("hidden");
}

btnFechar.onclick = fecharModal;


// ------------------- SALVAR EDIÇÃO --------------------
btnSalvar.onclick = async () => {

    const dados = {
        status: modalStatus.value,
        responsavel: modalResp.value
    };

    await fetch(`${API}/${ordemAtualId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    fecharModal();
    carregarOrdens();
};
