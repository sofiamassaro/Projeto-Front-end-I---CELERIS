import { processos } from "../data/processos.js";

import {
    getViewFila,
    getViewDocumento,
    getAiPanelFila,
    getAiPanelDoc,
    getDocTitle,
    getDocMeta,
    getDocContentText,
    getDocTags,
    getDocRepetitivos,
    getBackProcessNum,
    esconderTodasViews,
    sairModoCadastro
} from "../utils/dom.js";

export function abrirProcesso(index) {
    const p = processos[index];

    getDocTitle().textContent = `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA BANCÁRIA`;

    getDocMeta().innerHTML = `
        <p><strong>REQUERENTE:</strong> ${p.requerente}</p>
        <p><strong>REQUERIDO:</strong> ${p.requerido}</p>
        <p><strong>ASSUNTO:</strong> ${p.assunto}</p>
        <p><strong>NÚMERO:</strong> ${p.numero}</p>
    `;

    getDocContentText().textContent = p.conteudo;
    getBackProcessNum().textContent = p.numero;

    getDocTags().innerHTML = p.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join("");

    const textoRep = p.repetitivos === 0
        ? "Nenhum processo repetitivo encontrado."
        : `Foram encontrados <strong>${p.repetitivos} processos idênticos</strong>`;

    getDocRepetitivos().innerHTML = textoRep;

    esconderTodasViews();
    sairModoCadastro();
    getViewDocumento().style.display = "flex";
    getAiPanelDoc().style.display    = "block";
}

export function voltarParaFila() {
    esconderTodasViews();
    sairModoCadastro();
    getViewFila().style.display     = "flex";
    getAiPanelFila().style.display  = "block";
}