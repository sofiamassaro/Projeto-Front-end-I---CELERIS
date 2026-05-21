import { carregarFragmentos } from "../utils/loadViews.js";

import {
    processCards,
    btnVoltar,
    navItems
} from "./utils/dom.js";

import {
    abrirProcesso,
    voltarParaFila
} from "./views/documento.js";

import {
    mostrarSecaoGenerica
} from "./views/generica.js";

import { mostrarCadastro } from "./views/cadastro.js"; 

async function init() {
  await carregarFragmentos();          // injeta todos os fragmentos HTML
  await import("./views/cadastro.js"); // garante que os listeners do cadastro sejam registrados após o DOM estar pronto

  // ================= EVENTOS DOS CARDS =================
  document.querySelectorAll(".process-card").forEach(function(card) {
    card.addEventListener("click", function() {
      const index = parseInt(card.getAttribute("data-id"));
      abrirProcesso(index);
    });
  });

  // ================= BOTÃO VOLTAR =================
  document.getElementById("btn-voltar")
    .addEventListener("click", voltarParaFila);

  // ================= MENU LATERAL =================
  document.querySelectorAll(".nav-item").forEach(function(item) {
    item.addEventListener("click", function(event) {
      event.preventDefault();
      document.querySelectorAll(".nav-item")
        .forEach(link => link.classList.remove("active"));
      item.classList.add("active");
      const secao = item.getAttribute("data-section");

      if (secao === "triagem") {
        voltarParaFila();
      } else if (secao === "cadastrar") {
        mostrarCadastro();
      } else {
        mostrarSecaoGenerica(secao);
      }
    });
  });

  document.getElementById("btn-voltar-generica")
    .addEventListener("click", function () {
      document.querySelectorAll(".nav-item")
        .forEach(link => link.classList.remove("active"));
      document.querySelector('[data-section="triagem"]')
        .classList.add("active");
      voltarParaFila();
    });
}
// ───────────────────────────────────────────────────────────────────

init();