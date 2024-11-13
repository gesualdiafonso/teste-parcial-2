// Variável para armazenar los productos en carrito
let carrito = {};

// Funcion para cargar el carrito del localStorange
function cargarCarritoDeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Funcion para salvar el carrito en localStorange
function guardarCarritoNoLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar el carrito cuando incia la pagina
cargarCarritoDeLocalStorage();
renderCartModal();

// Función que abre el carrito
document.querySelector(".carrito").addEventListener("click", openCarrito);

function openCarrito() {
    if (!document.getElementById("modal-back")) {
        const modalBackground = document.createElement("div");
        modalBackground.className = "modal-back";

        modalBackground.innerHTML = `
            <div class="card-modal">
                <div class="modal-encabezado">
                    <h2>Carrito</h2>
                    <button id="cierreModal" type="button" class="btn btn-primary">X</button>
                </div>
                <div class="linea"></div>
                <div class="card-carrito px-5" id="cartItemsContainer"></div>
                <div class="botones">
                    <button type="button" class="btn btn-primary mt-lg-3 mx-auto" onclick="checkout()">Comprar</button>
                    <button type="button" class="btn btn-primary mt-lg-3 mx-auto" onclick="clearCart()">Quitar Carrito</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalBackground);
        document.getElementById("cierreModal").addEventListener("click", closeCarrito);
    }
    renderCartModal();
}

// Cierre del modal
function closeCarrito() {
    const modal = document.querySelector(".modal-back");
    if (modal) {
        modal.remove();
    }
}

//Funcion para renderizar los item de carrito 
function renderCartModal() {
    const carritoContainer = document.getElementById("cartItemsContainer");
    if (carritoContainer) {
        carritoContainer.innerHTML = "";

        let total = 0;
        let totalItems = 0;

        for (const productoId in carrito) {
            const item = carrito[productoId];
            const itemTotal = item.price * item.cantidad;
            total += itemTotal;
            totalItems += item.cantidad;

            const carritoItem = document.createElement("div");
            carritoItem.classList.add("card", "mb-3");
            carritoItem.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid img-stl">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h3 class="card-title">${item.name}</h3>
                            <span class="card-text text-body-secondary">Restan ${item.stock} en stock</span>
                            <span class="card-text text-body-secondary">Cantidad: ${item.cantidad}</span>
                            <span class="h3 text-center fw-semibold my-lg-5">U$${itemTotal.toLocaleString()}</span>
                        </div>
                        <div class="button-card">
                            <button type="button" class="btn btn-primary mt-lg-3 mx-auto" onclick="checkoutItem(${productoId})">Comprar</button>
                            <button type="button" class="btn btn-primary mt-lg-3 mx-auto" onclick="removeFromCart(${productoId})">Borrar</button>
                        </div>
                    </div>
                </div>
            `;

            carritoContainer.appendChild(carritoItem);
        }

        // Adiciona la cantidade total de itens y el valor total
        const totalContainer = document.createElement("div");
        totalContainer.className = "total-info d-flex justify-content-between mt-3";
        
        const totalItemsLabel = document.createElement("span");
        totalItemsLabel.textContent = `Total de itens: ${totalItems}`;

        const totalAmountLabel = document.createElement("span");
        totalAmountLabel.textContent = `Total a pagar: U$ ${total.toFixed(2)}`;

        totalContainer.appendChild(totalItemsLabel);
        totalContainer.appendChild(totalAmountLabel);

        carritoContainer.appendChild(totalContainer);
    }
}


// Funcion para add un item al carrito
function agregarAlCarrito(productId) {
    const producto = productosGlobal.find(p => p.id === productId);
    if (!producto) return;

    if (carrito[productId]) {
        if (carrito[productId].cantidad < producto.stock) {
            carrito[productId].cantidad++;
        } else {
            alert("Estoque insuficiente!");
        }
    } else {
        carrito[productId] = { ...producto, cantidad: 1 };
    }

    guardarCarritoNoLocalStorage();
    renderCartModal();
}

// Funcion para remover la cantidad de item
function removeFromCart(productId) {
    const item = carrito[productId];
    
    if (item.cantidad > 1) {
        //Dicto la cantidad
        item.cantidad--;
    } else {
        //Borro el item de carrito 
        delete carrito[productId];
    }
    
    guardarCarritoNoLocalStorage();
    renderCartModal();
}

//Funcion para limpiar el carrito todo 
function clearCart() {
    carrito = {};
    guardarCarritoNoLocalStorage();
    renderCartModal();
}

//Funcioón de simular el checkout 
function checkout() {
    alert("Compra realizada com sucesso!");
    clearCart();
}
