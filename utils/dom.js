// ================= SELEÇÕES ESTÁTICAS (existem no index.html desde o início) =================
// estas não dependem das views injetadas pelo loadViews.js
export const navItems = document.querySelectorAll(".nav-item");

// ================= SELEÇÕES DINÂMICAS (dependem das views injetadas) =================
// exportadas como funções para serem chamadas APÓS o carregarFragmentos()

export function getViewFila()         { return document.getElementById("view-fila"); }
export function getViewDocumento()    { return document.getElementById("view-documento"); }
export function getViewGenerica()     { return document.getElementById("view-generica"); }
export function getViewCadastro()     { return document.getElementById("view-cadastro"); }
export function getViewConfirmacao()  { return document.getElementById("view-confirmacao"); }
export function getAiPanelFila()      { return document.getElementById("ai-panel-fila"); }
export function getAiPanelDoc()       { return document.getElementById("ai-panel-documento"); }
export function getDocTitle()         { return document.getElementById("doc-title"); }
export function getDocMeta()          { return document.getElementById("doc-meta"); }
export function getDocContentText()   { return document.getElementById("doc-content-text"); }
export function getDocTags()          { return document.getElementById("doc-tags"); }
export function getDocRepetitivos()   { return document.getElementById("doc-repetitivos"); }
export function getBackProcessNum()   { return document.getElementById("back-process-num"); }

export function esconderTodasViews() {
    getViewFila().style.display        = "none";
    getViewDocumento().style.display   = "none";
    getViewGenerica().style.display    = "none";
    getViewCadastro().style.display    = "none";
    getViewConfirmacao().style.display = "none";
    getAiPanelFila().style.display     = "none";
    getAiPanelDoc().style.display      = "none";
}

export function sairModoCadastro() {
    document.body.classList.remove("modo-cadastro");
}