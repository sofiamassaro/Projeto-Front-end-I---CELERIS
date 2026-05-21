import {
    getViewGenerica,
    esconderTodasViews,
    sairModoCadastro
} from "../utils/dom.js";

export function mostrarSecaoGenerica(secao) {
    const secoes = {
        "repetitivas":   { titulo: "Demandas Repetitivas",       icone: "fas fa-layer-group" },
        "analisados":    { titulo: "Processos Analisados",        icone: "fas fa-check-double" },
        "relatorios":    { titulo: "Relatórios de Celeridade",    icone: "fas fa-chart-line" },
        "configuracoes": { titulo: "Configurações",               icone: "fas fa-cog" }
    };

    const dados = secoes[secao] || { titulo: "Seção", icone: "fas fa-folder" };

    document.getElementById("generica-title").textContent = dados.titulo;
    document.getElementById("generica-icon").innerHTML    = `<i class="${dados.icone}"></i>`;

    esconderTodasViews();
    sairModoCadastro();
    getViewGenerica().style.display = "flex";
}