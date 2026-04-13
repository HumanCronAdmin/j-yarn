(() => {
  let products = [];
  const BRAND_LABEL = {
    noro: "Noro", hamanaka: "Hamanaka", daruma: "Daruma (Yokota)",
    richmore: "Richmore", diamond: "Diamond", olympus: "Olympus"
  };
  const CATEGORY_LABEL = {
    sock: "Sock", fingering: "Fingering", dk: "DK", worsted: "Worsted",
    bulky: "Bulky", lace: "Lace", mohair: "Mohair", novelty: "Novelty"
  };
  const FIBER_LABEL = {
    wool: "Wool", silk: "Silk", cotton: "Cotton", alpaca: "Alpaca",
    mohair: "Mohair", acrylic: "Acrylic", blend: "Blend"
  };

  const $ = id => document.getElementById(id);

  function populateFilters() {
    const cats = [...new Set(products.map(p => p.category))].sort();
    const brands = [...new Set(products.map(p => p.brand))].sort();
    const fibers = [...new Set(products.map(p => p.fiber))].sort();

    cats.forEach(c => $("category").innerHTML += `<option value="${c}">${CATEGORY_LABEL[c] || c}</option>`);
    brands.forEach(b => $("brand").innerHTML += `<option value="${b}">${BRAND_LABEL[b] || b}</option>`);
    fibers.forEach(f => $("fiber").innerHTML += `<option value="${f}">${FIBER_LABEL[f] || f}</option>`);
  }

  function getFiltered() {
    const q = $("search").value.toLowerCase();
    const cat = $("category").value;
    const br = $("brand").value;
    const fib = $("fiber").value;
    const sort = $("sort").value;

    let list = products.filter(p => {
      if (cat && p.category !== cat) return false;
      if (br && p.brand !== br) return false;
      if (fib && p.fiber !== fib) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      return true;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price_usd - b.price_usd);
    else if (sort === "price-desc") list.sort((a, b) => b.price_usd - a.price_usd);
    else if (sort === "yardage-asc") list.sort((a, b) => a.yardage_m - b.yardage_m);
    else if (sort === "yardage-desc") list.sort((a, b) => b.yardage_m - a.yardage_m);

    return list;
  }

  function renderCard(p) {
    const prosHtml = (p.pros || []).map(pr => `<li>${pr}</li>`).join("");
    const expertHtml = p.expert_note ? `<div class="expert-note">${p.expert_note}</div>` : "";
    const linkHtml = p.amazon_url ? `<div class="product-link"><a href="${p.amazon_url}" target="_blank" rel="noopener">Search on Amazon</a></div>` : "";

    return `<div class="product-card">
      <div class="brand">${BRAND_LABEL[p.brand] || p.brand}</div>
      <h3>${p.name}</h3>
      <div class="badges">
        <span class="badge badge-cat">${CATEGORY_LABEL[p.category] || p.category}</span>
        <span class="badge badge-fiber">${FIBER_LABEL[p.fiber] || p.fiber}</span>
      </div>
      <div class="product-meta">
        <span>${p.fiber_content}</span>
        <span>${p.weight_g}g</span>
        <span>${p.yardage_m}m</span>
        <span>${p.needle_mm}mm</span>
        <span>${p.colorways} colors</span>
      </div>
      <div class="product-price">$${p.price_usd.toFixed(2)}</div>
      <ul class="product-pros">${prosHtml}</ul>
      <div class="product-best"><strong>Best for:</strong> ${p.best_for}</div>
      ${expertHtml}
      ${linkHtml}
    </div>`;
  }

  function render() {
    const list = getFiltered();
    $("resultCount").textContent = `${list.length} yarn${list.length !== 1 ? "s" : ""} found`;
    $("grid").innerHTML = list.map(renderCard).join("");
  }

  function init() {
    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        products = data;
        populateFilters();
        render();
      })
      .catch(err => {
        $("grid").innerHTML = `<p style="padding:24px;color:#78716C">Could not load products. ${err.message}</p>`;
      });

    ["search", "category", "brand", "fiber", "sort"].forEach(id => {
      $(id).addEventListener(id === "search" ? "input" : "change", render);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
