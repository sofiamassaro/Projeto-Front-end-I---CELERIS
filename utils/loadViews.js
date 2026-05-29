// ================= CARREGADOR DE VIEWS E COMPONENTES =================
// Faz fetch de cada fragmento HTML e injeta no placeholder correspondente.
// Retorna uma Promise que resolve quando TUDO estiver carregado,
// garantindo que o app.js só inicialize após o DOM estar completo.

const fragmentos = [
  // [ url do arquivo,          id do placeholder no index.html ]
  ["./components/sidebar.html",      "slot-sidebar"],
  ["./components/ai-panel.html",     "slot-ai-panel"],
  ["./views/upload.html",            "slot-upload"],
  ["./views/fila.html",              "slot-fila"],
  ["./views/documento.html",         "slot-documento"],
  ["./views/generica.html",          "slot-generica"],
  ["./views/cadastro.html",          "slot-cadastro"],
  ["./views/confirmacao.html",       "slot-confirmacao"],
];

export async function carregarFragmentos() {
  const promessas = fragmentos.map(async ([url, slotId]) => {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      console.error(`Erro ao carregar fragmento: ${url} (${resposta.status})`);
      return;
    }
    const html = await resposta.text();
    const slot = document.getElementById(slotId);
    if (slot) {
      slot.outerHTML = html; // substitui o placeholder pelo HTML real
    } else {
      console.warn(`Slot não encontrado: #${slotId}`);
    }
  });

  await Promise.all(promessas);
}
