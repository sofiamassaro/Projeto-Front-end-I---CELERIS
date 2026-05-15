// ================= CELERIS - SCRIPT PRINCIPAL =================

import { processos } from "./js/data/processos.js"; // importa os dados dos processos de um arquivo separado para manter o código organizado
import {
    viewFila,
    viewDocumento,
    viewGenerica,
    aiPanelFila,
    aiPanelDoc,
    docTitle,
    docMeta,
    docContentText,
    docTags,
    docRepetitivos,
    backProcessNum,
    btnVoltar,
    processCards,
    navItems
} from "./js/utils/dom.js";

document.addEventListener("DOMContentLoaded", function () {