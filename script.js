// ================= CELERIS - SCRIPT PRINCIPAL =================

import { processos } from "./js/data/processos.js"; // importa os dados dos processos de um arquivo separado para manter o código organizado

document.addEventListener("DOMContentLoaded", function () {

    // ================= SELEÇÃO DE ELEMENTOS =================
    // guarda referências para os elementos que vamos manipular

    // as duas "telas" da área central
    const viewFila       = document.getElementById("view-fila");
    const viewDocumento  = document.getElementById("view-documento");
    const viewGenerica   = document.getElementById("view-generica");

    // os dois estados do painel de IA
    const aiPanelFila    = document.getElementById("ai-panel-fila");
    const aiPanelDoc     = document.getElementById("ai-panel-documento");

    // campos do documento aberto
    const docTitle       = document.getElementById("doc-title");
    const docMeta        = document.getElementById("doc-meta");
    const docContentText = document.getElementById("doc-content-text");
    const docTags        = document.getElementById("doc-tags");
    const docRepetitivos = document.getElementById("doc-repetitivos");
    const backProcessNum = document.getElementById("back-process-num");

    // botão de voltar
    const btnVoltar      = document.getElementById("btn-voltar");

    // cards de processo na fila
    const processCards   = document.querySelectorAll(".process-card");

    // items do menu lateral
    const navItems       = document.querySelectorAll(".nav-item");

    // ================= FUNÇÃO: ABRIR PROCESSO =================
    // recebe o índice do processo no array e exibe o documento
    function abrirProcesso(index) {
        const p = processos[index]; // pega os dados do processo clicado

        // --- atualiza o documento ---
        docTitle.textContent = `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA BANCÁRIA`;
        
        // monta o bloco de metadados com os dados do processo
        docMeta.innerHTML = `
            <p><strong>REQUERENTE:</strong> ${p.requerente}</p>
            <p><strong>REQUERIDO:</strong> ${p.requerido}</p>
            <p><strong>ASSUNTO:</strong> ${p.assunto}</p>
            <p><strong>NÚMERO:</strong> ${p.numero}</p>
        `;

        // atualiza o texto da petição
        docContentText.textContent = p.conteudo;

        // mostra o número do processo na barra de voltar
        backProcessNum.textContent = p.numero;

        // --- atualiza o painel de IA ---
        // reconstrói as tags de classificação com os dados do processo
        docTags.innerHTML = p.tags
            .map(tag => `<span class="tag">${tag}</span>`)
            .join("");

        // atualiza a contagem de repetitivos
        const textoRep = p.repetitivos === 0
            ? "Nenhum processo repetitivo encontrado."
            : `Foram encontrados <strong>${p.repetitivos} processo${p.repetitivos > 1 ? "s" : ""} idêntico${p.repetitivos > 1 ? "s" : ""}</strong>`;
        docRepetitivos.innerHTML = textoRep;

        // --- troca de visualização ---
        // esconde a fila e mostra o documento
        viewFila.style.display      = "none";
        viewDocumento.style.display = "flex";

        // esconde o painel da fila e mostra o painel do documento
        aiPanelFila.style.display = "none";
        aiPanelDoc.style.display  = "block";

        // animação de fade no documento para dar feedback visual de carregamento
        const paper = document.querySelector(".document-paper");
        paper.style.opacity = "0";
        setTimeout(() => { paper.style.opacity = "1"; }, 150);
    }

    // ================= FUNÇÃO: VOLTAR PARA A FILA =================
    function voltarParaFila() {
        viewFila.style.display        = "flex";
        viewDocumento.style.display   = "none";
        viewGenerica.style.display    = "none";
        aiPanelFila.style.display     = "block";
        aiPanelDoc.style.display      = "none";
    }

    // ================= EVENTOS: CARDS DA FILA =================
    // adiciona o evento de clique em cada card da fila
    processCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const index = parseInt(card.getAttribute("data-id")); // pega o índice
            abrirProcesso(index); // abre o processo correspondente
        });
    });

    // ================= EVENTO: BOTÃO VOLTAR =================
    btnVoltar.addEventListener("click", voltarParaFila);

    // ================= FUNÇÃO: MOSTRAR SEÇÃO GENÉRICA =================
    // exibe a tela de "em desenvolvimento" para seções ainda não implementadas
    function mostrarSecaoGenerica(secao) {

        // mapeia cada seção para seu título e ícone correspondente
        const secoes = {
            "repetitivas":   { titulo: "Demandas Repetitivas",      icone: "fas fa-layer-group" },
            "analisados":    { titulo: "Processos Analisados",       icone: "fas fa-check-double" },
            "relatorios":    { titulo: "Relatórios de Celeridade",   icone: "fas fa-chart-line" },
            "configuracoes": { titulo: "Configurações",              icone: "fas fa-cog" }
        };

        const dados = secoes[secao] || { titulo: "Seção", icone: "fas fa-folder" };

        // atualiza o título e o ícone da tela genérica
        document.getElementById("generica-title").textContent = dados.titulo;
        document.getElementById("generica-icon").innerHTML = `<i class="${dados.icone}"></i>`;

        // esconde as outras views e mostra a genérica
        viewFila.style.display        = "none";
        viewDocumento.style.display   = "none";
        viewGenerica.style.display    = "flex";

        // esconde os dois painéis de IA (a tela genérica não tem painel)
        aiPanelFila.style.display = "none";
        aiPanelDoc.style.display  = "none";
    }

    // ================= EVENTO: BOTÃO VOLTAR DA TELA GENÉRICA =================
    document.getElementById("btn-voltar-generica").addEventListener("click", function () {
        // volta para a triagem: ativa o item do menu e exibe a fila
        navItems.forEach(link => link.classList.remove("active"));
        document.querySelector('[data-section="triagem"]').classList.add("active");
        voltarParaFila();
    });


    // controla qual item da sidebar está ativo e troca o conteúdo central
    navItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.preventDefault(); // impede o link de recarregar a página

            // remove o "active" de todos e coloca no clicado
            navItems.forEach(link => link.classList.remove("active"));
            item.classList.add("active");

            const secao = item.getAttribute("data-section");

            // se for a seção de triagem: garante que volta para a fila
            if (secao === "triagem") {
                voltarParaFila();
            } else {
                // para as outras seções, mostra a tela genérica com nome e ícone corretos
                mostrarSecaoGenerica(secao);
            }
        });
    });

});