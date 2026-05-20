// js/views/cadastro.js

import {
    viewCadastro,
    viewConfirmacao,
    esconderTodasViews,
    navItems
} from "../utils/dom.js";

import { voltarParaFila } from "./documento.js";

// importa o array de processos — vamos inserir nele ao confirmar o cadastro
import { processos } from "../data/processos.js";

// ================= MAPA: CLASSE → TAGS =================
// garante que as tags geradas no cadastro sejam idênticas às dos processos existentes
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

// ================= CAMPOS DO FORMULÁRIO =================
const campoNumero      = document.getElementById("cad-numero");
const campoData        = document.getElementById("cad-data");
const campoRequerente  = document.getElementById("cad-requerente");
const campoRequerido   = document.getElementById("cad-requerido");
const campoClasse      = document.getElementById("cad-classe");
const campoPrioridade  = document.getElementById("cad-prioridade");
const campoConteudo    = document.getElementById("cad-conteudo");      // corpo da petição → "conteudo" no modelo
const campoObs         = document.getElementById("cad-obs");           // observações internas
const campoTagsPreview = document.getElementById("cad-tags-preview"); // preview somente-leitura das tags
const formError        = document.getElementById("form-error");
const formErrorMsg     = document.getElementById("form-error-msg");

// ================= CAMPOS DA TELA DE CONFIRMAÇÃO =================
const confNumero          = document.getElementById("conf-numero");
const confData            = document.getElementById("conf-data");       // exibe dataEntrada formatada
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

// ================= HELPER: FORMATAR DATA =================
// input type="date" retorna "yyyy-mm-dd" → converte para "dd/mm/yyyy"
function formatarData(valor) {
    if (!valor) return "—";
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
}

// ================= HELPER: PREVIEW DE TAGS =================
// atualiza o bloco de tags no formulário conforme a classe selecionada
function atualizarPreviewTags(classe) {
    const tags = TAGS_POR_CLASSE[classe];

    if (!tags) {
        campoTagsPreview.innerHTML =
            `<span class="form-tags-placeholder">Selecione a classe processual para gerar as tags</span>`;
        return;
    }

    campoTagsPreview.innerHTML = tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join("");
}

// ================= HELPER: RENDERIZAR CARD NA FILA =================
// insere o HTML do novo processo no topo da lista, estrutura idêntica aos cards existentes
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

    // importação dinâmica evita dependência circular entre cadastro.js e documento.js
    card.addEventListener("click", function () {
        import("./documento.js").then(({ abrirProcesso }) => {
            abrirProcesso(novoIndex);
        });
    });

    lista.insertBefore(card, lista.firstChild);
}

// ================= HELPER: ATUALIZAR CONTADORES =================
// sincroniza o chip da fila e o badge vermelho da sidebar com o total real do array
function atualizarContadores() {
    const total = processos.length;

    const filaCount = document.getElementById("fila-count");
    if (filaCount) filaCount.textContent = `${total} processos aguardando`;

    const badgeTriagem = document.getElementById("badge-triagem");
    if (badgeTriagem) badgeTriagem.textContent = total;
}

// ================= HELPER: TOAST DE SUCESSO =================
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

// ================= MOSTRAR FORMULÁRIO =================
export function mostrarCadastro() {
    esconderTodasViews();
    viewCadastro.style.display = "flex";
    formError.style.display    = "none";
    document.body.classList.add("modo-cadastro");
}

// ================= VALIDAR E IR PARA CONFIRMAÇÃO =================
function revisarCadastro() {
    const numero      = campoNumero.value.trim();
    const dataEntrada = campoData.value;           // nome da variável local alinhado com o modelo
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

    confNumero.textContent     = numero;
    confData.textContent       = formatarData(dataEntrada); // exibe no formato dd/mm/yyyy
    confRequerente.textContent = requerente;
    confRequerido.textContent  = requerido;
    confClasse.textContent     = classe;

    const prioridade = campoPrioridade.value;
    const labels = { normal: "Normal", prioritario: "Prioritário", urgente: "Urgente" };
    confPrioridade.textContent = labels[prioridade];

    confBadge.className   = `status-badge ${prioridade}`;
    confBadge.textContent = labels[prioridade];

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
    viewConfirmacao.style.display = "flex";
}

// ================= CONFIRMAR E INCLUIR NA FILA =================
function confirmarCadastro() {
    const classe = campoClasse.value;
    const tags   = TAGS_POR_CLASSE[classe] || ["Outros"];

    // objeto com estrutura idêntica aos processos existentes em processos.js
    const novoProcesso = {
        numero:      campoNumero.value.trim(),
        dataEntrada: campoData.value,
        requerente:  campoRequerente.value.trim(),
        requerido:   campoRequerido.value.trim(),
        assunto:     classe,
        status:      campoPrioridade.value,
        tags:        tags,
        repetitivos: 0,
        conteudo:    campoConteudo.value.trim()
    };

    processos.push(novoProcesso);
    inserirCardNaFila(novoProcesso);
    atualizarContadores();

    // limpa o formulário para o próximo cadastro
    campoNumero.value     = "";
    campoData.value       = "";
    campoRequerente.value = "";
    campoRequerido.value  = "";
    campoClasse.value     = "";
    campoPrioridade.value = "normal";
    campoConteudo.value   = "";
    campoObs.value        = "";
    atualizarPreviewTags("");

    navItems.forEach(link => link.classList.remove("active"));
    document.querySelector('[data-section="triagem"]').classList.add("active");
    voltarParaFila();
    mostrarToast("Processo cadastrado e incluído na fila com sucesso!");
}

// ================= EVENTOS =================
campoClasse.addEventListener("change", function () {
    atualizarPreviewTags(campoClasse.value);
});

document.getElementById("btn-revisar-cadastro")
    .addEventListener("click", revisarCadastro);

document.getElementById("btn-confirmar-cadastro")
    .addEventListener("click", confirmarCadastro);

document.getElementById("btn-editar-cadastro")
    .addEventListener("click", () => {
        esconderTodasViews();
        viewCadastro.style.display = "flex";
        document.body.classList.add("modo-cadastro");
    });

document.getElementById("btn-cancelar-cadastro")
    .addEventListener("click", () => {
        navItems.forEach(link => link.classList.remove("active"));
        document.querySelector('[data-section="triagem"]').classList.add("active");
        voltarParaFila();
    });
    