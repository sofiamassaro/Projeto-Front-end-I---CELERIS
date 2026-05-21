import { processos } from "../data/processos.js";

import {
    viewFila,
    viewDocumento,
    aiPanelFila,
    aiPanelDoc,
    docTitle,
    docMeta,
    docContentText,
    docTags,
    docRepetitivos,
    backProcessNum,
    esconderTodasViews,
    sairModoCadastro
} from "../utils/dom.js";

export function abrirProcesso(index) {

    const p = processos[index];

    docTitle.textContent =
        `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA BANCÁRIA`;

    docMeta.innerHTML = `
        <p><strong>REQUERENTE:</strong> ${p.requerente}</p>
        <p><strong>REQUERIDO:</strong> ${p.requerido}</p>
        <p><strong>ASSUNTO:</strong> ${p.assunto}</p>
        <p><strong>NÚMERO:</strong> ${p.numero}</p>
    `;

    docContentText.textContent = p.conteudo;

    backProcessNum.textContent = p.numero;

    docTags.innerHTML = p.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join("");

    const textoRep = p.repetitivos === 0
        ? "Nenhum processo repetitivo encontrado."
        : `Foram encontrados <strong>${p.repetitivos} processos idênticos</strong>`;

    docRepetitivos.innerHTML = textoRep;

    esconderTodasViews();
    sairModoCadastro();
    viewDocumento.style.display = "flex";
    aiPanelDoc.style.display = "block";
}

export function voltarParaFila() {
    esconderTodasViews();
    sairModoCadastro();
    viewFila.style.display = "flex";
    aiPanelFila.style.display = "block";
}