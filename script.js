const pendingProcesses = [
    {
        id: "0001",
        title: "Ação Revisional de Contrato",
        parties: "João da Silva vs Banco do Brasil",
        subject: "Revisão de juros abusivos",
        status: "Pendente",
        details: "Solicitação de revisão de cláusulas de contrato de financiamento bancário com juros supostamente abusivos."
    },
    {
        id: "0002",
        title: "Cobrança Indevida",
        parties: "Maria Pereira vs Santander",
        subject: "Contestação de débito",
        status: "Pendente",
        details: "Análise de cobrança de tarifas e encargos não previstos em contrato."
    },
    {
        id: "0003",
        title: "Ação de Consignado",
        parties: "Carlos Alberto vs Itaú",
        subject: "Nulidade de contrato",
        status: "Pendente",
        details: "Pedido de revisão de contrato consignado com valores questionados."
    }
];

function renderPendingList() {
    const listContainer = document.querySelector(".pending-list");
    listContainer.innerHTML = "";

    pendingProcesses.forEach((process, index) => {
        const item = document.createElement("li");
        item.className = "pending-item";
        item.textContent = `${process.title} — ${process.subject}`;
        item.dataset.processId = process.id;

        item.addEventListener("click", () => {
            document.querySelectorAll(".pending-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            showProcessDetails(process.id);
        });

        if (index === 0) {
            item.classList.add("active");
        }

        listContainer.appendChild(item);
    });
}

function showProcessDetails(processId) {
    const process = pendingProcesses.find(item => item.id === processId);
    if (!process) return;

    document.querySelector(".doc-title").textContent = process.title;
    document.querySelector(".doc-meta").innerHTML = `
        <p><strong>Partes:</strong> ${process.parties}</p>
        <p><strong>Assunto:</strong> ${process.subject}</p>
        <p><strong>Status:</strong> ${process.status}</p>
    `;
    document.querySelector(".doc-content").innerHTML = `
        <p>${process.details}</p>
        <p class="placeholder-text">Selecione outro processo pendente para ver novos detalhes.</p>
    `;
}

function initPlatform() {
    renderPendingList();
    showProcessDetails(pendingProcesses[0].id);

    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();
            document.querySelectorAll(".nav-item").forEach(link => link.classList.remove("active"));
            item.classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", initPlatform);
