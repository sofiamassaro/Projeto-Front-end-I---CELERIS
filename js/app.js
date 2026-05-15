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

// ================= EVENTOS DOS CARDS =================

processCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const index =
            parseInt(card.getAttribute("data-id"));

        abrirProcesso(index);
    });

});


// ================= BOTÃO VOLTAR =================

btnVoltar.addEventListener("click", voltarParaFila);


// ================= MENU LATERAL =================

navItems.forEach(function(item) {

    item.addEventListener("click", function(event) {

        event.preventDefault();

        navItems.forEach(link =>
            link.classList.remove("active")
        );

        item.classList.add("active");

        const secao =
            item.getAttribute("data-section");

        if (secao === "triagem") {

            voltarParaFila();

        } else {

            mostrarSecaoGenerica(secao);
        }

    });

});

document
    .getElementById("btn-voltar-generica")
    .addEventListener("click", function () {

        navItems.forEach(link =>
            link.classList.remove("active")
        );

        document
            .querySelector('[data-section="triagem"]')
            .classList.add("active");

        voltarParaFila();

    });