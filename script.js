// ================= SIDEBAR INTERATIVA =================

// espera a página carregar antes de executar o JavaScript
document.addEventListener("DOMContentLoaded", function () { 

    // seleciona todos os itens do menu lateral
    const navItems = document.querySelectorAll(".nav-item");

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

            // diciona a classe "active" somente no item clicado
            item.classList.add("active");
        });
    });
});