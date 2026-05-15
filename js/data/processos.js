   // ================= DADOS DOS PROCESSOS =================
    // array com todos os processos da fila de triagem
    // cada objeto representa um processo e guarda suas informações
    
export const processos = [
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