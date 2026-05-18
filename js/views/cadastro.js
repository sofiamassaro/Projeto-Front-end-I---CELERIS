// importa as referências dos elementos HTML que já existem no dom.js
// assim não precisamos usar document.getElementById aqui para esses elementos
import {
    viewFila,        // section da fila de triagem
    viewDocumento,   // section do documento aberto
    viewGenerica,    // section das telas genéricas (em desenvolvimento)
    aiPanelFila,     // painel de IA da fila (lado direito)
    aiPanelDoc,      // painel de IA do documento aberto
    navItems         // todos os itens do menu lateral
} from "../utils/dom.js";

// esses elementos são específicos do cadastro, então pegamos aqui mesmo
// eles não estão no dom.js porque só existem quando o cadastro é usado
const viewCadastro     = document.getElementById("view-cadastro");      // section do formulário
const viewConfirmacao  = document.getElementById("view-confirmacao");   // section da tela de confirmação

// ================= CAMPOS DO FORMULÁRIO =================
// cada variável aponta para um campo de input do HTML
// o id no HTML precisa bater exatamente com o que está aqui
const campoNumero      = document.getElementById("cad-numero");       // input do número do processo
const campoData        = document.getElementById("cad-data");         // input de data
const campoRequerente  = document.getElementById("cad-requerente");   // input do autor
const campoRequerido   = document.getElementById("cad-requerido");    // input do réu
const campoClasse      = document.getElementById("cad-classe");       // select da classe processual
const campoPrioridade  = document.getElementById("cad-prioridade");   // select da prioridade
const campoObs         = document.getElementById("cad-obs");          // textarea de observações
const formError        = document.getElementById("form-error");       // div do bloco de erro (fica oculta)
const formErrorMsg     = document.getElementById("form-error-msg");   // span com o texto do erro

// ================= CAMPOS DA TELA DE CONFIRMAÇÃO =================
// esses elementos exibem os dados preenchidos no formulário
// o usuário vai ver aqui o que acabou de digitar, para revisar antes de confirmar
const confNumero       = document.getElementById("conf-numero");       // exibe o número
const confData         = document.getElementById("conf-data");         // exibe a data formatada
const confRequerente   = document.getElementById("conf-requerente");   // exibe o requerente
const confRequerido    = document.getElementById("conf-requerido");    // exibe o requerido
const confClasse       = document.getElementById("conf-classe");       // exibe a classe escolhida
const confPrioridade   = document.getElementById("conf-prioridade");   // exibe a prioridade em texto
const confBadge        = document.getElementById("conf-badge");        // o badge colorido de prioridade
const confObs          = document.getElementById("conf-obs");          // exibe as observações
const confObsWrapper   = document.getElementById("conf-obs-wrapper");  // bloco que envolve as obs (some se vazio)

// ================= HELPER: ESCONDER TUDO =================
// função utilitária que esconde todas as sections e painéis de IA de uma vez
// usada sempre que precisamos trocar de tela — garante que nenhuma tela fique
// visível por acidente em cima da outra
function esconderTudo() {
    document.getElementById("view-fila").style.display         = "none";
    document.getElementById("view-documento").style.display    = "none";
    document.getElementById("view-generica").style.display     = "none";
    document.getElementById("view-cadastro").style.display     = "none";
    document.getElementById("view-confirmacao").style.display  = "none";
    document.getElementById("ai-panel-fila").style.display     = "none";
    document.getElementById("ai-panel-documento").style.display = "none";
    document.querySelector(".ai-panel").style.display           = "none";
    document.querySelector(".ai-panel").style.display           = "none";
}

// ================= HELPER: FORMATAR DATA =================
// o input type="date" retorna a data no formato americano: "2025-05-09"
// essa função converte para o formato brasileiro: "09/05/2025"
// se não tiver valor, retorna "—" para não deixar em branco
function formatarData(valor) {
    if (!valor) return "—";
    const [ano, mes, dia] = valor.split("-"); // quebra a string pelo hífen
    return `${dia}/${mes}/${ano}`;            // remonta na ordem correta
}

// ================= HELPER: TOAST DE SUCESSO =================
// cria dinamicamente um elemento de notificação ("toast") no canto da tela
// ele aparece com animação, fica visível por 3.5 segundos e some sozinho
// não usamos alert() porque fica mais profissional e não trava a página
function mostrarToast(msg) {
    const toast = document.createElement("div"); // cria o elemento na memória
    toast.className = "toast-sucesso";           // aplica o estilo do CSS
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`; // ícone + mensagem
    document.body.appendChild(toast);           // insere no HTML

    // o setTimeout garante que o browser renderize o elemento antes de adicionar a classe
    // sem esse delay de 50ms a animação CSS não funciona
    setTimeout(() => toast.classList.add("visivel"), 50);

    // após 3.5s remove a classe "visivel" (inicia o fade out) e depois remove o elemento do DOM
    setTimeout(() => {
        toast.classList.remove("visivel");
        setTimeout(() => toast.remove(), 400); // espera a animação de saída terminar
    }, 3500);
}

// ================= MOSTRAR FORMULÁRIO =================
// função exportada — o app.js vai chamar ela quando o usuário clicar em "Cadastrar Petição"
// o export torna ela acessível fora desse arquivo
export function mostrarCadastro() {
    esconderTudo();                          // limpa todas as telas
    viewCadastro.style.display = "flex";    // exibe o formulário
    formError.style.display    = "none";    // garante que o erro anterior não apareça
    document.body.classList.add("modo-cadastro");
}

// ================= VALIDAR E IR PARA CONFIRMAÇÃO =================
// chamada quando o usuário clica em "Revisar Cadastro"
// primeiro valida se os campos obrigatórios estão preenchidos
// se sim, popula a tela de confirmação com os dados e a exibe
function revisarCadastro() {

    // .trim() remove espaços em branco das pontas — evita que o usuário
    // passe na validação digitando só espaços
    const numero     = campoNumero.value.trim();
    const data       = campoData.value;
    const requerente = campoRequerente.value.trim();
    const requerido  = campoRequerido.value.trim();
    const classe     = campoClasse.value; // select não precisa de trim

    // se qualquer campo obrigatório estiver vazio, exibe o erro e para aqui
    // o return impede que o código continue executando
    if (!numero || !data || !requerente || !requerido || !classe) {
        formErrorMsg.textContent = "Preencha todos os campos obrigatórios antes de continuar.";
        formError.style.display  = "flex"; // torna o bloco de erro visível
        return;                            // sai da função sem ir para confirmação
    }

    formError.style.display = "none"; // esconde o erro se estava visível

    // preenche cada campo da tela de confirmação com os valores digitados
    confNumero.textContent     = numero;
    confData.textContent       = formatarData(data); // já converte para dd/mm/aaaa
    confRequerente.textContent = requerente;
    confRequerido.textContent  = requerido;
    confClasse.textContent     = classe;

    // pega o valor do select de prioridade e converte para texto legível
    const prioridade = campoPrioridade.value; // retorna "normal", "prioritario" ou "urgente"
    const labels = { normal: "Normal", prioritario: "Prioritário", urgente: "Urgente" };
    confPrioridade.textContent = labels[prioridade]; // ex: "prioritario" → "Prioritário"

    // atualiza o badge de status — a classe CSS define a cor (igual aos cards da fila)
    confBadge.className   = `status-badge ${prioridade}`; // ex: "status-badge urgente"
    confBadge.textContent = labels[prioridade];

    // observações são opcionais: só exibe o bloco se o usuário preencheu
    const obs = campoObs.value.trim();
    if (obs) {
        confObs.textContent          = obs;
        confObsWrapper.style.display = "flex"; // mostra o bloco de observações
    } else {
        confObsWrapper.style.display = "none"; // esconde se estiver vazio
    }

    // troca de tela: esconde tudo e exibe a confirmação
    esconderTudo();
    viewConfirmacao.style.display = "flex";
}

// ================= CONFIRMAR E INCLUIR NA FILA =================
// chamada quando o usuário clica em "Confirmar e Incluir na Fila"
// por enquanto só limpa o formulário e volta para a triagem com toast
// no futuro aqui vai entrar a chamada para o backend ou a inserção no array de processos
function confirmarCadastro() {

    // limpa todos os campos do formulário para o próximo cadastro
    campoNumero.value     = "";
    campoData.value       = "";
    campoRequerente.value = "";
    campoRequerido.value  = "";
    campoClasse.value     = "";       // no select, "" volta para a opção disabled
    campoPrioridade.value = "normal"; // volta para o valor padrão
    campoObs.value        = "";

   navItems.forEach(link => link.classList.remove("active"));
    document.querySelector('[data-section="triagem"]').classList.add("active");

    document.getElementById("view-fila").style.display          = "flex";
    document.getElementById("view-confirmacao").style.display   = "none";
    document.getElementById("ai-panel-fila").style.display      = "block";
    document.querySelector(".ai-panel").style.display           = "block";
    document.body.classList.remove("modo-cadastro");

    mostrarToast("Processo cadastrado e incluído na fila com sucesso!");
}

// ================= EVENTOS =================
// conecta cada botão à sua função correspondente

// botão "Revisar Cadastro" no formulário → valida e vai para confirmação
document.getElementById("btn-revisar-cadastro")
    .addEventListener("click", revisarCadastro);

// botão "Confirmar e Incluir na Fila" na tela de confirmação → finaliza o cadastro
document.getElementById("btn-confirmar-cadastro")
    .addEventListener("click", confirmarCadastro);

// botão "Editar" na tela de confirmação → volta para o formulário sem perder os dados
// os campos ainda têm os valores porque não limpamos, apenas trocamos de tela
document.getElementById("btn-editar-cadastro")
    .addEventListener("click", () => {
        esconderTudo();
        viewCadastro.style.display = "flex"; // volta para o form com os dados intactos
    });

// botão "Cancelar" no formulário → descarta e volta para a triagem
document.getElementById("btn-cancelar-cadastro")
    .addEventListener("click", () => {
        navItems.forEach(link => link.classList.remove("active"));
        document.querySelector('[data-section="triagem"]').classList.add("active");

        document.getElementById("view-fila").style.display      = "flex";
        document.getElementById("view-cadastro").style.display  = "none";
        document.getElementById("ai-panel-fila").style.display  = "block";
        document.querySelector(".ai-panel").style.display       = "block";
        document.body.classList.remove("modo-cadastro");
    });