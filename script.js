// ================= CELERIS - SCRIPT PRINCIPAL =================

document.addEventListener("DOMContentLoaded", function () {

    // ================= DADOS DOS PROCESSOS =================
    // array com todos os processos da fila de triagem
    // cada objeto representa um processo e guarda suas informações
    const processos = [
        {
            numero: "5003421-12.2024.8.24.0023",
            requerente: "João da Silva",
            requerido: "Banco do Brasil S.A.",
            assunto: "Ação Revisional de Juros — Financiamento de Veículo",
            status: "urgente",
            tags: ["Direito Bancário", "Revisional de Juros"],
            repetitivos: 12,
            conteudo: "O autor celebrou contrato de financiamento de veículo automotor com o réu, tendo sido cobradas taxas de juros acima do limite permitido pelo Banco Central do Brasil..."
        },
        {
            numero: "5003987-44.2024.8.24.0023",
            requerente: "Maria Oliveira",
            requerido: "Caixa Econômica Federal",
            assunto: "Revisão de Contrato de Financiamento Imobiliário",
            status: "prioritario",
            tags: ["Financiamento", "Imobiliário"],
            repetitivos: 4,
            conteudo: "A autora contratou financiamento imobiliário pelo programa habitacional, alegando irregularidades na aplicação do índice de correção monetária durante o período de carência..."
        },
        {
            numero: "5004102-88.2024.8.24.0023",
            requerente: "Pedro Alves",
            requerido: "Itaú Unibanco S.A.",
            assunto: "Indenização por Dano Moral — Cobrança Indevida",
            status: "normal",
            tags: ["Consumidor", "Dano Moral"],
            repetitivos: 0,
            conteudo: "O autor foi surpreendido com cobrança indevida em sua fatura de cartão de crédito, referente a serviço que alega nunca ter contratado, sendo negativado indevidamente..."
        },
        {
            numero: "5004388-21.2024.8.24.0023",
            requerente: "Ana Souza",
            requerido: "Bradesco S.A.",
            assunto: "Cobrança Indevida de Tarifas Bancárias",
            status: "normal",
            tags: ["Direito Bancário", "Tarifas"],
            repetitivos: 7,
            conteudo: "A autora questiona a legalidade da cobrança de tarifas de manutenção de conta corrente e pacote de serviços, alegando que as cobranças foram realizadas sem autorização expressa..."
        },
        {
            numero: "5004512-67.2024.8.24.0023",
            requerente: "Carlos Mendes",
            requerido: "Santander Brasil S.A.",
            assunto: "Negativação Indevida no SPC/Serasa",
            status: "urgente",
            tags: ["Consumidor", "Negativação"],
            repetitivos: 2,
            conteudo: "O autor teve seu nome inscrito nos órgãos de proteção ao crédito em razão de dívida que alega já ter sido quitada, requerendo tutela de urgência para exclusão imediata da negativação..."
        },
        {
            numero: "5004701-33.2024.8.24.0023",
            requerente: "Luciana Ferreira",
            requerido: "Nubank S.A.",
            assunto: "Revisão de Limite e Contestação de Cobranças",
            status: "normal",
            tags: ["Crédito", "Fintech"],
            repetitivos: 1,
            conteudo: "A autora contesta cobranças realizadas em seu cartão de crédito, afirmando não reconhecer as transações listadas, e requer o ressarcimento dos valores debitados indevidamente..."
        },
        {
            numero: "5004899-14.2024.8.24.0023",
            requerente: "Roberto Lima",
            requerido: "Banco Inter S.A.",
            assunto: "Revisão de Contrato de Empréstimo Consignado",
            status: "prioritario",
            tags: ["Consignado", "Revisão Contratual"],
            repetitivos: 3,
            conteudo: "O autor, servidor público aposentado, questiona a taxa de juros aplicada em seu contrato de empréstimo consignado, alegando que supera o teto estabelecido em normativa do INSS..."
        }
    ];

    // ================= SELEÇÃO DE ELEMENTOS =================
    // guarda referências para os elementos que vamos manipular

    // as duas "telas" da área central
    const viewFila       = document.getElementById("view-fila");
    const viewDocumento  = document.getElementById("view-documento");

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
        // mostra a fila e esconde o documento
        viewFila.style.display      = "flex";
        viewDocumento.style.display = "none";

        // mostra o painel da fila e esconde o painel do documento
        aiPanelFila.style.display = "block";
        aiPanelDoc.style.display  = "none";
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

    // ================= EVENTOS: MENU LATERAL =================
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
                // para as outras seções, esconde a fila e mostra uma mensagem genérica
                // (aqui você pode futuramente adicionar conteúdo real para cada seção)
                viewFila.style.display     = "none";
                viewDocumento.style.display = "none";
                aiPanelFila.style.display  = "none";
                aiPanelDoc.style.display   = "none";
                // TODO: adicionar views específicas para cada seção
            }
        });
    });

});