import { carregarFragmentos } from "./utils/loadViews.js";
import { abrirProcesso, voltarParaFila } from "./views/documento.js";
import { mostrarSecaoGenerica } from "./views/generica.js";

async function init() {

  await carregarFragmentos();

  // importa cadastro.js SÓ AQUI, após o DOM estar pronto
  const { mostrarCadastro, registrarEventos } = await import("./views/cadastro.js");
  registrarEventos();

  // cards da fila
  document.querySelectorAll(".process-card").forEach(function(card) {
    card.addEventListener("click", function() {
      abrirProcesso(parseInt(card.getAttribute("data-id")));
    });
  });

  // botão voltar
  document.getElementById("btn-voltar")
    .addEventListener("click", voltarParaFila);

  // menu lateral
  document.querySelectorAll(".nav-item").forEach(function(item) {
    item.addEventListener("click", function(event) {
      event.preventDefault();
      document.querySelectorAll(".nav-item")
        .forEach(link => link.classList.remove("active"));
      item.classList.add("active");
      const secao = item.getAttribute("data-section");

      if (secao === "triagem")        voltarParaFila();
      else if (secao === "cadastrar") mostrarCadastro();
      else                            mostrarSecaoGenerica(secao);
    });
  });

  document.getElementById("btn-voltar-generica")
    .addEventListener("click", function () {
      document.querySelectorAll(".nav-item")
        .forEach(link => link.classList.remove("active"));
      document.querySelector('[data-section="triagem"]').classList.add("active");
      voltarParaFila();
    });
}

init();
