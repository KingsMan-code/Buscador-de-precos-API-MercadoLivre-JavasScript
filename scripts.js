const searchForm = document.querySelector('.search-form');
const productList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart');

let myChart = '';

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    console.log(inputValue);

    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
    const products = (await data.json()).results.slice(0, 10);
    console.log(products);

    displayItems(products);
    updatePriceChart(products);
})

function displayItems(products) {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-price">${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <P class="product-store">Loja: ${product.seller.nickname}</P>
        </div>
    `).join('');
}

function updatePriceChart(products) {
    const ctx = priceChart.getContext('2d');  // Corrigido aqui
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0, 20) + '...'),  // Corrigido aqui
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(product => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) { return 'R$' + value.toLocaleString('pt-BR'); }
                    }
                }
            },
            plugins: {  // Corrigido aqui
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top 10 produtos',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}