document.addEventListener('alpine:init', () => {
    Alpine.store('settings', {
        apiBaseUrl: 'http://127.0.0.1:3383/api/store',
        appName: 'E-commerce Application'
    });
    
    Alpine.store('cart', {
        items: [],
        
        init() {
            const savedCart = localStorage.getItem('cart');
            this.items = savedCart ? JSON.parse(savedCart) : [];
        },
        
        addItem(product) {
            const existingItem = this.items.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    ...product,
                    quantity: 1
                });
            }
            
            this.saveCart();
            return this.items.length;
        },
        
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        },
        
        getCount() {
            return this.items.reduce((count, item) => count + item.quantity, 0);
        }
    });
});

function navigateTo(page) {
    console.log('Navigating to:', page);
    fetch(`pages/${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('app-content').innerHTML = html;
        })
        .catch(error => {
            console.error('Navigation error:', error);
            document.getElementById('app-content').innerHTML = `
                <div class="ui negative message">
                    <div class="header">Error</div>
                    <p>Failed to load page: ${error.message}</p>
                </div>
            `;
        });
}

function addToCart(product) {
    const count = Alpine.store('cart').addItem(product);
    alert(`Added ${product.name} to cart. Cart now has ${count} items.`);
}

document.addEventListener('alpine:initialized', () => {
    $('.ui.dropdown').dropdown();
});

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('product/product_display');
});