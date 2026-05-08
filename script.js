// ================= SIDEBAR INTERATIVA =================

// espera a página carregar antes de executar o JavaScript
document.addEventListener("DOMContentLoaded", function () { 

    // seleciona todos os itens do menu lateral
    const navItems = document.querySelectorAll(".nav-item");

    // dados para cada seção (simulando conteúdo dinâmico)
    const sectionData = {
        "Triagem Pendente": {
            title: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO...",
            content: "O autor celebrou contrato de financiamento... [Conteúdo da Triagem Pendente]"
        },
        "Demandas Repetitivas": {
            title: "DEMANDAS REPETITIVAS IDENTIFICADAS",
            content: "Foram encontradas 12 demandas similares... [Detalhes das repetitivas]"
        },
        "Processos Analisados": {
            title: "PROCESSOS JÁ ANALISADOS",
            content: "Lista de processos concluídos... [Histórico de análises]"
        },
        "Relatórios de Celeridade": {
            title: "RELATÓRIOS DE CELERIDADE",
            content: "Estatísticas de tempo de resposta... [Dados de performance]"
        },
        "Configurações": {
            title: "CONFIGURAÇÕES DO SISTEMA",
            content: "Opções de personalização... [Ajustes disponíveis]"
        }
    };

    // passa por cada item do menu
    navItems.forEach(function (item) {

        // adiciona evento de clique em cada item
        item.addEventListener("click", function (event) {

            // impede o link de recarregar ou sair da página
            event.preventDefault();

            // remove a classe "active" de todos os itens
            navItems.forEach(function (link) {
                link.classList.remove("active");
            });

            // adiciona a classe "active" somente no item clicado
            item.classList.add("active");

            // obtém o texto do item clicado (sem o ícone)
            const itemText = item.textContent.trim();

            // verifica se há dados para essa seção
            if (sectionData[itemText]) {
                // atualiza o título do documento
                document.querySelector(".doc-title").textContent = sectionData[itemText].title;
                
                // atualiza o conteúdo do documento
                document.querySelector(".doc-content p:first-child").textContent = sectionData[itemText].content;
                
                // opcional: animação de fade para destacar a mudança
                const docPaper = document.querySelector(".document-paper");
                docPaper.style.opacity = "0.5";
                setTimeout(() => {
                    docPaper.style.opacity = "1";
                }, 200);
            }
        });
    });
});