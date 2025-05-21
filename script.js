const properties = [
  {
    id: 1,
    title: "Galpão para locação",
    neighborhood: "Bairro",
    type: "Galpao",
    purpose: "Locação",
    price: 1200,
    size: 85,
    bedrooms: '0',
    bathrooms: '0',
    images: [
      "galpaoimobiliaria.jpg"
    ],
    location: "Local",
    whatsapp: "5598999999991",
  },
  //{
    //id: 2,
    //title: "Casa espaçosa para alugar",
    //neighborhood: "Jardim",
    //type: "Casa",
   // purpose: "Aluguel",
   // price: 3500,
    //size: 150,
  //  bedrooms: 4,
    //bathrooms: 3,
  //  images: [
     // "https://picsum.photos/id/1020/600/400",
   //   "https://picsum.photos/id/1021/600/400",
 //   ],
    //location: "Rua Caio Prado, Centro, Itapipoca",
  //  whatsapp: "5598999999992",
  //},
  //{
   //id: 3,
    //title: "Cobertura moderna a venda",
    //neighborhood: "Nova Aldeota",
    //type: "Cobertura",
    //purpose: "Venda",
    //price: 800000,
    //size: 120,
    //bedrooms: 3,
    //bathrooms: 2,
    //images: [
      ////"https://picsum.photos/id/1022/600/400",
      //"https://picsum.photos/id/1023/600/400",
    //],
    //location: "Rua Tenente Jose Vicente, Nova Aldeota, Itapipoca",
    //whatsapp: "5598999999993",
  //},
];

// Extrai bairros únicos não vazios para filtro
function getNeighborhoods() {
  const set = new Set(properties.filter(p => p.neighborhood).map(p => p.neighborhood));
  return Array.from(set);
}

// Preenche o filtro de bairros
function fillNeighborhoodFilter() {
  const select = document.getElementById("neighborhoodFilter");
  select.innerHTML = '<option value="">Bairro</option>';
  const bairros = getNeighborhoods();
  if (bairros.length === 0) {
    select.innerHTML += `<option value="">Sem bairros cadastrados</option>`;
  } else {
    bairros.forEach((bairro) => {
      select.innerHTML += `<option value="${bairro}">${bairro}</option>`;
    });
  }
}

// Filtra e exibe imóveis na lista
function displayProperties() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const purpose = document.getElementById("purposeFilter").value;
  const neighborhood = document.getElementById("neighborhoodFilter").value;
  const minPrice = Number(document.getElementById("minPrice").value) || 0;
  const maxPrice = Number(document.getElementById("maxPrice").value) || Infinity;

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search) || (p.location && p.location.toLowerCase().includes(search));
    const matchesType = !type || p.type === type;
    const matchesPurpose = !purpose || p.purpose === purpose;
    const matchesNeighborhood = !neighborhood || p.neighborhood === neighborhood;
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

    return matchesSearch && matchesType && matchesPurpose && matchesNeighborhood && matchesPrice;
  });

  const list = document.getElementById("propertyList");
  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = `<p class="text-center text-muted">Nenhum imóvel encontrado.</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${p.images[0]}" class="card-img-top" alt="${p.title}" style="height: 180px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text text-truncate">${p.location || "Sem bairro cadastrado" }</p>
          <p class="card-text text-muted mb-1">${p.purpose}</p>
          <p class="text-success fw-bold mb-2">R$ ${p.price.toLocaleString('pt-BR')}</p>
          <button class="btn btn-primary mt-auto" onclick="showDetails(${p.id})">Ver detalhes</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

// Mostra o modal com detalhes
function showDetails(id) {
  const property = properties.find(p => p.id === id);
  if (!property) return;

  document.getElementById("modalTitle").textContent = property.title;
  document.getElementById("modalLocation").textContent = property.location || "";
  document.getElementById("modalPurpose").textContent = property.purpose;
  document.getElementById("modalPrice").textContent = `R$ ${property.price.toLocaleString("pt-BR")}`;
  document.getElementById("modalWhatsApp").href = `https://wa.me/${property.whatsapp}`;

  // Preenche o carrossel
  const carouselInner = document.getElementById("carouselInner");
  carouselInner.innerHTML = "";
  property.images.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "carousel-item" + (i === 0 ? " active" : "");
    div.innerHTML = `<img src="${img}" class="d-block w-100" alt="${property.title}">`;
    carouselInner.appendChild(div);
  });

  // Preenche os detalhes extras
  const detailsDiv = document.getElementById("propertyDetails");
  detailsDiv.innerHTML = `
    <ul class="list-unstyled mb-0">
      <li><strong>Tipo:</strong> ${property.type}</li>
      <li><strong>Tamanho:</strong> ${property.size} m²</li>
      <li><strong>Quartos:</strong> ${property.bedrooms}</li>
      <li><strong>Banheiros:</strong> ${property.bathrooms}</li>
    </ul>
  `;

  const modal = new bootstrap.Modal(document.getElementById("propertyModal"));
  modal.show();
}

// Eventos filtros e busca
document.getElementById("searchInput").addEventListener("input", displayProperties);
document.getElementById("typeFilter").addEventListener("change", displayProperties);
document.getElementById("purposeFilter").addEventListener("change", displayProperties);
document.getElementById("neighborhoodFilter").addEventListener("change", displayProperties);
document.getElementById("minPrice").addEventListener("input", displayProperties);
document.getElementById("maxPrice").addEventListener("input", displayProperties);

// Inicialização
fillNeighborhoodFilter();
displayProperties();
