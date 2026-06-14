const API_KEY = "rc_live_0f1501ddfd484259bd5be2d65c85371e";

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(link);

const style = document.createElement('style');
style.innerHTML = `
    body, .modal-content, .card {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }
    .btn-custom-blue {
        background-color: #1e3a8a !important;
        color: white !important;
        border: none !important;
        transition: background-color 0.2s ease;
    }
    .btn-custom-blue:hover {
        background-color: #2563eb !important;
        color: white !important;
    }
    .text-custom-dark {
        color: #1e3a8a !important;
    }
`;
document.head.appendChild(style);

const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modal = new bootstrap.Modal(document.getElementById("one-country"));

function loadCountries(region) {
    countriesList.innerHTML = "<p class='text-center w-100 fw-bold text-muted'>Načítám...</p>";

    fetch(`https://api.restcountries.com/countries/v5/region/${region}`, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    })
    .then(res => res.json())
    .then(result => {
        const data = result.data?.objects || [];
        countriesList.innerHTML = "";

        data.forEach((country) => {
            let czechName = "Neznámé";
            if (country.names?.translations?.ces) {
                czechName = typeof country.names.translations.ces === "object"
                    ? (country.names.translations.ces.common || country.names.translations.ces.name)
                    : country.names.translations.ces;
            } else {
                czechName = country.names?.common || "Neznámé";
            }
            
            const flagUrl = country.flag?.url_png || country.flag?.url_svg || "";
            const capitalCity = country.capitals?.[0]?.name || "Neznámé";

            let blockCountry = `
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card h-100 shadow-sm border-0" style="border-radius: 12px; overflow: hidden;">
                        <img class="card-img-top border-bottom" 
                             src="${flagUrl}" 
                             alt="${czechName}" 
                             style="height: 140px; object-fit: cover; width: 100%;" />
                        <div class="card-body d-flex flex-column text-center">
                            <h5 class="card-title fw-bold text-custom-dark mb-2" style="font-size: 1.1rem;">${czechName}</h5>
                            <p class="card-text text-muted small mb-3">
                                Hlavní město:<br>
                                <span class="fw-semibold text-secondary">${capitalCity}</span>
                            </p>
                            <button class="btn btn-custom-blue mt-auto btn-sm w-100 shadow-none fw-medium" 
                                    data-name="${country.names?.common}" style="border-radius: 8px;">
                                Více informací
                            </button>
                        </div>
                    </div>
                </div>
            `;
            countriesList.innerHTML += blockCountry;
        });

        document.querySelectorAll('button[data-name]').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll('button[data-name]').forEach(button => {
            button.addEventListener('click', () => {
                const countryName = button.getAttribute('data-name');

                fetch(`https://api.restcountries.com/countries/v5/names.common/${encodeURIComponent(countryName)}`, {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`
                    }
                })
                .then(res => res.json())
                .then(result => {
                    const country = result.data?.objects?.[0];
                    if (!country) return;

                    let czechName = "Neznámé";
                    if (country.names?.translations?.ces) {
                        czechName = typeof country.names.translations.ces === "object"
                            ? (country.names.translations.ces.common || country.names.translations.ces.name)
                            : country.names.translations.ces;
                    } else {
                        czechName = country.names?.common || "Neznámé";
                    }

                    let officialName = "Neznámé";
                    if (country.names?.translations?.ces) {
                        officialName = typeof country.names.translations.ces === "object"
                            ? (country.names.translations.ces.official || czechName)
                            : czechName;
                    } else {
                        officialName = country.names?.official || czechName;
                    }

                    const flagUrl = country.flag?.url_png || country.flag?.url_svg || "";
                    const capitalCity = country.capitals?.[0]?.name || "Neznámé";

                    let geoRegion = country.region || "Neznámé";
                    let geoSubregion = country.subregion || "Neznámé";

                    let currencyText = "Neznámé";
                    if (country.currencies && country.currencies.length > 0) {
                        currencyText = country.currencies.map(c => `${c.name} (${c.symbol || ''})`).join(', ');
                    }

                    let languagesText = "Neznámé";
                    if (country.languages && country.languages.length > 0) {
                        languagesText = country.languages.map(l => l.name).join(', ');
                    }

                    modalBody.innerHTML = `
                        <div class="text-center mb-4">
                            <img src="${flagUrl}" class="img-fluid rounded border shadow-sm mb-3" style="max-height: 160px; object-fit: contain; display: block; margin: 0 auto;">
                            <h3 class="fw-bold mb-1 text-custom-dark">${czechName}</h3>
                            <p class="text-muted small">${officialName}</p>
                        </div>
                        <hr>
                        <div class="row g-2 text-start px-2" style="font-size: 0.95rem;">
                            <div class="col-6 mb-2"><b>Hlavní město:</b></div><div class="col-6 text-secondary">${capitalCity}</div>
                            <div class="col-6 mb-2"><b>Region / Subregion:</b></div><div class="col-6 text-secondary">${geoRegion} / ${geoSubregion}</div>
                            <div class="col-6 mb-2"><b>Počet obyvatel:</b></div><div class="col-6 text-secondary">${country.population ? country.population.toLocaleString('cs-CZ') : 'Neznámé'}</div>
                            <div class="col-6 mb-2"><b>Oficiální jazyky:</b></div><div class="col-6 text-secondary">${languagesText}</div>
                            <div class="col-6 mb-2"><b>Měna:</b></div><div class="col-6 text-secondary">${currencyText}</div>
                        </div>
                    `;

                    modal.show();
                })
                .catch(err => console.log("Detail chyba:", err));
            });
        });

    })
    .catch(error => {
        console.log("Fetch chyba:", error);
        countriesList.innerHTML = "<p class='text-center text-danger w-100'>Chyba při načítání dat</p>";
    });
}

loadCountries("Europe");

continent.addEventListener("change", function(event) {
    loadCountries(event.target.value);
});