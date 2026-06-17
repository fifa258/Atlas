const API_KEY = "rc_live_0f1501ddfd484259bd5be2d65c85371e";

const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modal = new bootstrap.Modal(document.getElementById("one-country"));

function loadCountries(region) {
    countriesList.innerHTML = "Načítám...";

    fetch(`https://api.restcountries.com/countries/v5/region/${region}`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    })
    .then(res => res.json())
    .then(result => {
        const data = result.data?.objects || [];
        countriesList.innerHTML = "";

        data.forEach(country => {
            let czechName = country.names?.common || "Neznámé";

            if (country.names?.translations?.ces) {
                czechName = typeof country.names.translations.ces === "object"
                    ? (country.names.translations.ces.common || country.names.translations.ces.name)
                    : country.names.translations.ces;
            }

            countriesList.innerHTML += `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${country.flag?.url_png || ""}" style="height:140px;object-fit:contain;width:100%;">
                        <div class="card-body text-center">
                            <h5>${czechName}</h5>
                            <p>${country.capitals?.[0]?.name || "Neznámé"}</p>
                            <button class="btn btn-primary w-100" data-name="${country.names?.common}">
                                Více informací
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        document.querySelectorAll("button[data-name]").forEach(btn => {
            btn.addEventListener("click", () => {
                const name = btn.getAttribute("data-name");

                fetch(`https://api.restcountries.com/countries/v5/names.common/${encodeURIComponent(name)}`, {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`
                    }
                })
                .then(res => res.json())
                .then(result => {
                    const country = result.data?.objects?.[0];
                    if (!country) return;

                    modalBody.innerHTML = `
                        <div class="text-center mb-3">
                            <img src="${country.flag?.url_png || ""}" style="max-height:150px;">
                            <h3>${country.names?.common}</h3>
                        </div>

                        <p><b>Hlavní město:</b> ${country.capitals?.[0]?.name || "Neznámé"}</p>
                        <p><b>Region:</b> ${country.region || "Neznámé"}</p>
                        <p><b>Subregion:</b> ${country.subregion || "Neznámé"}</p>
                        <p><b>Populace:</b> ${country.population?.toLocaleString() || "Neznámé"}</p>
                        <p><b>Jazyky:</b> ${country.languages?.map(l => l.name).join(", ") || "Neznámé"}</p>
                        <p><b>Měny:</b> ${country.currencies?.map(c => c.name).join(", ") || "Neznámé"}</p>
                    `;

                    modal.show();
                });
            });
        });

    })
    .catch(err => {
        console.log(err);
        countriesList.innerHTML = "Chyba při načítání";
    });
}

loadCountries("Europe");

continent.addEventListener("change", e => {
    loadCountries(e.target.value);
});