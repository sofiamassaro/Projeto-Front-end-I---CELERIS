import {
    getViewCadastro,
    getViewConfirmacao,
    esconderTodasViews,
    navItems,
    setWorkflowStep
} from "../utils/dom.js";

import { voltarParaFila } from "./documento.js";
import { processos } from "../data/processos.js";

const TAGS_POR_CLASSE = {
    "Ação Revisional de Juros":             ["Direito Bancário", "Revisional de Juros"],
    "Indenização por Dano Moral":           ["Consumidor", "Dano Moral"],
    "Cobrança Indevida de Tarifas":         ["Direito Bancário", "Tarifas"],
    "Negativação Indevida no SPC/Serasa":   ["Consumidor", "Negativação"],
    "Revisão de Contrato de Financiamento": ["Financiamento", "Imobiliário"],
    "Revisão de Empréstimo Consignado":     ["Consignado", "Revisão Contratual"],
    "Revisão de Limite de Crédito":         ["Crédito", "Fintech"],
    "Execução de Título Extrajudicial":     ["Execução", "Título Extrajudicial"],
    "Ação Monitória":                       ["Monitória", "Cobrança"],
    "Outro":                                ["Outros"]
};

function formatarData(valor) {
    if (!valor) return "—";
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
}

function atualizarPreviewTags(classe, campoTagsPreview) {
    const tags = TAGS_POR_CLASSE[classe];
    if (!tags) {
        campoTagsPreview.innerHTML =
            `<span class="form-tags-placeholder">Selecione a classe processual para gerar as tags</span>`;
        return;
    }
    campoTagsPreview.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join("");
}

function inserirCardNaFila(processo) {
    const lista = document.getElementById("process-list");
    const labels = { normal: "Normal", prioritario: "Prioritário", urgente: "Urgente" };
    const dataFormatada = formatarData(processo.dataEntrada);
    const novoIndex = processos.length - 1;
    const textoRep = processo.repetitivos === 1 ? "1 repetitivo" : `${processo.repetitivos} repetitivos`;

    const card = document.createElement("div");
    card.className = "process-card";
    card.setAttribute("data-id", novoIndex);
    card.innerHTML = `
        <div class="process-card-top">
            <span class="process-num">${processo.numero}</span>
            <span class="status-badge ${processo.status}">${labels[processo.status]}</span>
        </div>
        <div class="process-card-title">${processo.requerente} vs. ${processo.requerido}</div>
        <div class="process-card-sub">${processo.assunto}</div>
        <div class="process-card-meta">
            <span class="process-tag">${processo.tags[0]}</span>
            <span class="process-meta-info"><i class="fas fa-calendar-alt"></i> Entrada: ${dataFormatada}</span>
            <span class="process-meta-info"><i class="fas fa-copy"></i> ${textoRep}</span>
        </div>
    `;
    card.addEventListener("click", function () {
        import("./documento.js").then(({ abrirProcesso }) => abrirProcesso(novoIndex));
    });
    lista.insertBefore(card, lista.firstChild);
}

function atualizarContadores() {
    const total = processos.length;
    const filaCount = document.getElementById("fila-count");
    if (filaCount) filaCount.textContent = `${total} processos aguardando`;
    const badgeTriagem = document.getElementById("badge-triagem");
    if (badgeTriagem) badgeTriagem.textContent = total;
}

function mostrarToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast-sucesso";
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("visivel"), 50);
    setTimeout(() => {
        toast.classList.remove("visivel");
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

export function mostrarCadastro() {
    const formError = document.getElementById("form-error");
    esconderTodasViews();
    getViewCadastro().style.display = "flex";
    formError.style.display         = "none";
    document.body.classList.add("modo-cadastro");
    setWorkflowStep("cadastrar");
}

export function registrarEventos() {
    // todos os getElementById ficam aqui dentro — DOM já existe neste ponto
    const campoNumero      = document.getElementById("cad-numero");
    const campoData        = document.getElementById("cad-data");
    const campoRequerente  = document.getElementById("cad-requerente");
    const campoCpf         = document.getElementById("cad-cpf");
    const campoRequerido   = document.getElementById("cad-requerido");
    const campoCpfRequerido= document.getElementById("cad-cpf-requerido");
    const campoClasse      = document.getElementById("cad-classe");
    const campoPrioridade  = document.getElementById("cad-prioridade");
    const campoConteudo    = document.getElementById("cad-conteudo");
    const campoObs         = document.getElementById("cad-obs");
    const campoTagsPreview = document.getElementById("cad-tags-preview");
    const formError        = document.getElementById("form-error");
    const formErrorMsg     = document.getElementById("form-error-msg");

    const confNumero          = document.getElementById("conf-numero");
    const confData            = document.getElementById("conf-data");
    const confRequerente      = document.getElementById("conf-requerente");
    const confRequerido       = document.getElementById("conf-requerido");
    const confClasse          = document.getElementById("conf-classe");
    const confPrioridade      = document.getElementById("conf-prioridade");
    const confBadge           = document.getElementById("conf-badge");
    const confTags            = document.getElementById("conf-tags");
    const confConteudo        = document.getElementById("conf-conteudo");
    const confConteudoWrapper = document.getElementById("conf-conteudo-wrapper");
    const confObs             = document.getElementById("conf-obs");
    const confObsWrapper      = document.getElementById("conf-obs-wrapper");

    campoClasse.addEventListener("change", function () {
        atualizarPreviewTags(campoClasse.value, campoTagsPreview);
    });

    document.getElementById("btn-revisar-cadastro").addEventListener("click", function() {
        const numero      = campoNumero.value.trim();
        const dataEntrada = campoData.value;
        const requerente  = campoRequerente.value.trim();
        const requerido   = campoRequerido.value.trim();
        const classe      = campoClasse.value;
        const conteudo    = campoConteudo.value.trim();

        if (!numero || !dataEntrada || !requerente || !requerido || !classe || !conteudo) {
            formErrorMsg.textContent = "Preencha todos os campos obrigatórios antes de continuar.";
            formError.style.display  = "flex";
            return;
        }
        formError.style.display = "none";

        const prioridade = campoPrioridade.value;
        const labels = { normal: "Normal", prioritario: "Prioritário", urgente: "Urgente" };

        confNumero.textContent     = numero;
        confData.textContent       = formatarData(dataEntrada);
        confRequerente.textContent = requerente;
        confRequerido.textContent  = requerido;
        confClasse.textContent     = classe;
        confPrioridade.textContent = labels[prioridade];
        confBadge.className        = `status-badge ${prioridade}`;
        confBadge.textContent      = labels[prioridade];

        const tags = TAGS_POR_CLASSE[classe] || ["Outros"];
        confTags.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join("");

        confConteudo.textContent          = conteudo;
        confConteudoWrapper.style.display = "flex";

        const obs = campoObs.value.trim();
        if (obs) {
            confObs.textContent          = obs;
            confObsWrapper.style.display = "flex";
        } else {
            confObsWrapper.style.display = "none";
        }

        esconderTodasViews();
        getViewConfirmacao().style.display = "flex";
    });

    document.getElementById("btn-confirmar-cadastro").addEventListener("click", function() {
        const classe = campoClasse.value;
        const tags   = TAGS_POR_CLASSE[classe] || ["Outros"];

        const novoProcesso = {
            numero:          campoNumero.value.trim(),
            dataEntrada:     campoData.value,
            requerente:      campoRequerente.value.trim(),
            cpfRequerente:   campoCpf.value.trim(),
            requerido:       campoRequerido.value.trim(),
            cpfRequerido:    campoCpfRequerido.value.trim(),
            assunto:         classe,
            status:          campoPrioridade.value,
            tags:            tags,
            repetitivos:     0,
            conteudo:        campoConteudo.value.trim()
        };

        processos.push(novoProcesso);
        inserirCardNaFila(novoProcesso);
        atualizarContadores();

        campoNumero.value        = "";
        campoData.value          = "";
        campoRequerente.value    = "";
        campoCpf.value           = "";
        campoRequerido.value     = "";
        campoCpfRequerido.value  = "";
        campoClasse.value        = "";
        campoPrioridade.value    = "normal";
        campoConteudo.value      = "";
        campoObs.value           = "";
        atualizarPreviewTags("", campoTagsPreview);

        navItems.forEach(link => link.classList.remove("active"));
        document.querySelector('[data-section="triagem"]').classList.add("active");
        voltarParaFila();
        mostrarToast("Processo cadastrado e incluído na fila com sucesso!");
    });

    document.getElementById("btn-editar-cadastro").addEventListener("click", () => {
        esconderTodasViews();
        getViewCadastro().style.display = "flex";
        document.body.classList.add("modo-cadastro");
    });

    document.getElementById("btn-cancelar-cadastro").addEventListener("click", () => {
        navItems.forEach(link => link.classList.remove("active"));
        document.querySelector('[data-section="triagem"]').classList.add("active");
        voltarParaFila();
    });
}