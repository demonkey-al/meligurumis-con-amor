(() => {
    "use strict";

    const STORAGE_KEY = "meligurumis-carrito-artesanal-v1";
    const MAX_QUANTITY = 99;

    const fallbackProducts = [
        {
            id: "local-muneca",
            title: "Muñeca tejida personalizada",
            description: "Muñeca de crochet hecha a mano, con cabello azul, vestido blanco y delicados detalles bordados.",
            price: 35000,
            image: "assets/img/producto-1.jpg"
        },
        {
            id: "local-gato-negro",
            title: "Gatito negro amigurumi",
            description: "Gatito tejido a crochet en color negro, con ojos amarillos y bigotes que le dan una expresión única.",
            price: 22000,
            image: "assets/img/producto-2.jpg"
        },
        {
            id: "local-gato-tricolor",
            title: "Gatito tricolor amigurumi",
            description: "Gatito artesanal tejido en blanco, negro y mostaza, con nariz rosa y detalles llenos de ternura.",
            price: 24000,
            image: "assets/img/producto-3.jpg"
        }
    ];

    const moneyFormatter = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    });

    const elements = {
        productList: document.querySelector("#lista-productos"),
        productStatus: document.querySelector("#estado-productos"),
        cartList: document.querySelector("#lista-carrito"),
        cartCount: document.querySelector("#contador-carrito"),
        summaryQuantity: document.querySelector("#cantidad-resumen"),
        cartTotal: document.querySelector("#total-carrito"),
        checkoutButton: document.querySelector("#finalizar-compra"),
        cartMessage: document.querySelector("#mensaje-carrito"),
        contactForm: document.querySelector("#formulario-contacto"),
        formButton: document.querySelector("#enviar-formulario"),
        formStatus: document.querySelector("#estado-formulario"),
        currentYear: document.querySelector("#anio-actual")
    };

    let products = [];
    let cart = loadCart();

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function normalizeImageUrl(value, fallback = "assets/img/logo.jpg") {
        if (typeof value !== "string" || value.trim() === "") {
            return fallback;
        }

        if (!value.includes("://")) {
            return value;
        }

        try {
            const url = new URL(value);
            return ["http:", "https:"].includes(url.protocol) ? url.href : fallback;
        } catch {
            return fallback;
        }
    }

    function normalizeProduct(product) {
        const price = Number(product.price);

        if (
            product.id === undefined
            || typeof product.title !== "string"
            || !Number.isFinite(price)
            || price < 0
        ) {
            return null;
        }

        return {
            id: String(product.id),
            title: product.title.trim() || "Producto sin nombre",
            description: typeof product.description === "string"
                ? product.description.trim()
                : "Sin descripción disponible.",
            price,
            image: normalizeImageUrl(product.image)
        };
    }

    async function fetchProducts() {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch("./productos.json", { signal: controller.signal });

            if (!response.ok) {
                throw new Error(`La API respondió con el estado ${response.status}`);
            }

            const data = await response.json();
            const normalizedProducts = Array.isArray(data)
                ? data.map(normalizeProduct).filter(Boolean)
                : [];

            if (normalizedProducts.length === 0) {
                throw new Error("La API no devolvió productos válidos");
            }

            products = normalizedProducts;
            elements.productStatus.hidden = true;
        } catch (error) {
            console.warn("No se pudo cargar productos.json; se usa el catálogo de respaldo.", error);
            products = fallbackProducts.map(normalizeProduct).filter(Boolean);
            elements.productStatus.hidden = false;
            elements.productStatus.className = "estado estado-error";
            elements.productStatus.textContent = "No se pudo cargar el catálogo. Mostramos temporalmente los productos artesanales de respaldo.";
        } finally {
            window.clearTimeout(timeoutId);
            renderProducts();
        }
    }

    function buildProductCard(product) {
        const article = createElement("article", "producto");
        const imageContainer = createElement("div", "producto-imagen-contenedor");
        const image = document.createElement("img");
        const content = createElement("div", "producto-contenido");
        const title = createElement("h3", "", product.title);
        const description = createElement("p", "producto-descripcion", product.description);
        const price = createElement("p", "producto-precio", moneyFormatter.format(product.price));
        const button = createElement("button", "boton", "Agregar al carrito");

        image.src = product.image;
        image.alt = `Imagen de ${product.title}`;
        image.width = 320;
        image.height = 225;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
            image.src = "assets/img/logo.jpg";
            image.alt = `Imagen no disponible para ${product.title}`;
        }, { once: true });

        button.type = "button";
        button.dataset.productId = product.id;
        button.setAttribute("aria-label", `Agregar ${product.title} al carrito`);

        imageContainer.append(image);
        content.append(title, description, price, button);
        article.append(imageContainer, content);

        return article;
    }

    function renderProducts() {
        const fragment = document.createDocumentFragment();

        products.forEach((product) => {
            fragment.append(buildProductCard(product));
        });

        elements.productList.replaceChildren(fragment);
    }

    function loadCart() {
        try {
            const storedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

            if (!Array.isArray(storedCart)) {
                return [];
            }

            return storedCart
                .map((item) => {
                    const normalizedProduct = normalizeProduct(item);
                    const quantity = Math.min(MAX_QUANTITY, Math.max(1, Number.parseInt(item.quantity, 10) || 1));

                    return normalizedProduct ? { ...normalizedProduct, quantity } : null;
                })
                .filter(Boolean);
        } catch {
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.warn("El navegador no permitió guardar el carrito.", error);
            showCartMessage("No fue posible guardar el carrito en este navegador.", true);
        }
    }

    function showCartMessage(message, isError = false) {
        elements.cartMessage.textContent = message;
        elements.cartMessage.className = `mensaje-estado ${isError ? "mensaje-error" : "mensaje-exito"}`;
    }

    function updateCart() {
        saveCart();
        renderCart();
    }

    function addToCart(productId) {
        const product = products.find((item) => item.id === productId);

        if (!product) {
            showCartMessage("No pudimos encontrar ese producto.", true);
            return;
        }

        const existingItem = cart.find((item) => item.id === productId);

        if (existingItem) {
            existingItem.quantity = Math.min(MAX_QUANTITY, existingItem.quantity + 1);
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
        showCartMessage(`${product.title} se agregó al carrito.`);
    }

    function setQuantity(productId, nextQuantity) {
        const item = cart.find((product) => product.id === productId);

        if (!item) {
            return;
        }

        const quantity = Number.parseInt(nextQuantity, 10);

        if (!Number.isFinite(quantity) || quantity < 1) {
            removeFromCart(productId);
            return;
        }

        item.quantity = Math.min(MAX_QUANTITY, quantity);
        updateCart();
    }

    function removeFromCart(productId) {
        const item = cart.find((product) => product.id === productId);
        cart = cart.filter((product) => product.id !== productId);
        updateCart();

        if (item) {
            showCartMessage(`${item.title} se eliminó del carrito.`);
        }
    }

    function buildCartItem(item) {
        const article = createElement("article", "item-carrito");
        const image = document.createElement("img");
        const info = createElement("div", "item-carrito-info");
        const title = createElement("h3", "", item.title);
        const unitPrice = createElement("p", "item-carrito-precio", `Precio unitario: ${moneyFormatter.format(item.price)}`);
        const actions = createElement("div", "item-carrito-acciones");
        const quantityControl = createElement("div", "control-cantidad");
        const decreaseButton = createElement("button", "", "−");
        const quantityInput = document.createElement("input");
        const increaseButton = createElement("button", "", "+");
        const removeButton = createElement("button", "eliminar-producto", "Eliminar");
        const subtotal = createElement(
            "p",
            "item-carrito-subtotal",
            `Subtotal: ${moneyFormatter.format(item.price * item.quantity)}`
        );

        image.src = item.image;
        image.alt = `Miniatura de ${item.title}`;
        image.width = 94;
        image.height = 94;
        image.loading = "lazy";
        image.addEventListener("error", () => {
            image.src = "assets/img/logo.jpg";
        }, { once: true });

        decreaseButton.type = "button";
        decreaseButton.dataset.action = "decrease";
        decreaseButton.dataset.productId = item.id;
        decreaseButton.setAttribute("aria-label", `Disminuir cantidad de ${item.title}`);

        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.max = String(MAX_QUANTITY);
        quantityInput.value = String(item.quantity);
        quantityInput.dataset.action = "quantity";
        quantityInput.dataset.productId = item.id;
        quantityInput.setAttribute("aria-label", `Cantidad de ${item.title}`);

        increaseButton.type = "button";
        increaseButton.dataset.action = "increase";
        increaseButton.dataset.productId = item.id;
        increaseButton.setAttribute("aria-label", `Aumentar cantidad de ${item.title}`);

        removeButton.type = "button";
        removeButton.dataset.action = "remove";
        removeButton.dataset.productId = item.id;
        removeButton.setAttribute("aria-label", `Eliminar ${item.title} del carrito`);

        quantityControl.append(decreaseButton, quantityInput, increaseButton);
        actions.append(quantityControl, removeButton);
        info.append(title, unitPrice, actions);
        article.append(image, info, subtotal);

        return article;
    }

    function renderCart() {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        elements.cartCount.textContent = String(totalQuantity);
        elements.cartCount.setAttribute(
            "aria-label",
            `${totalQuantity} ${totalQuantity === 1 ? "producto" : "productos"} en el carrito`
        );
        elements.summaryQuantity.textContent = String(totalQuantity);
        elements.cartTotal.textContent = moneyFormatter.format(totalPrice);
        elements.checkoutButton.disabled = cart.length === 0;

        if (cart.length === 0) {
            const emptyState = createElement("div", "carrito-vacio");
            emptyState.append(
                createElement("h3", "", "Tu carrito está vacío"),
                createElement("p", "", "Agregá un producto para comenzar tu compra.")
            );
            elements.cartList.replaceChildren(emptyState);
            return;
        }

        const fragment = document.createDocumentFragment();
        cart.forEach((item) => fragment.append(buildCartItem(item)));
        elements.cartList.replaceChildren(fragment);
    }

    function validateField(field) {
        const value = field.value.trim();
        let message = "";

        if (value === "") {
            message = "Este campo es obligatorio.";
        } else if (field.name === "nombre" && value.length < 2) {
            message = "Ingresá al menos 2 caracteres.";
        } else if (
            field.name === "email"
            && (
                field.validity.typeMismatch
                || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            )
        ) {
            message = "Ingresá un correo electrónico válido.";
        } else if (field.name === "mensaje" && value.length < 10) {
            message = "El mensaje debe tener al menos 10 caracteres.";
        }

        const errorElement = document.querySelector(`#error-${field.id}`);
        field.setAttribute("aria-invalid", String(Boolean(message)));
        errorElement.textContent = message;

        return message === "";
    }

    function validateForm() {
        const fields = [...elements.contactForm.querySelectorAll("input, textarea")];
        const validity = fields.map(validateField);
        const firstInvalidIndex = validity.findIndex((isValid) => !isValid);

        if (firstInvalidIndex !== -1) {
            fields[firstInvalidIndex].focus();
            return false;
        }

        return true;
    }

    async function submitContactForm(event) {
        event.preventDefault();
        elements.formStatus.textContent = "";
        elements.formStatus.className = "mensaje-estado";

        if (!validateForm()) {
            elements.formStatus.textContent = "Revisá los campos señalados antes de enviar.";
            elements.formStatus.classList.add("mensaje-error");
            return;
        }

        elements.formButton.disabled = true;
        elements.formButton.textContent = "Enviando…";

        try {
            const response = await fetch(elements.contactForm.action, {
                method: elements.contactForm.method,
                body: new FormData(elements.contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Formspree respondió con el estado ${response.status}`);
            }

            elements.contactForm.reset();
            elements.contactForm.querySelectorAll("[aria-invalid]").forEach((field) => {
                field.setAttribute("aria-invalid", "false");
            });
            elements.contactForm.querySelectorAll(".error-campo").forEach((error) => {
                error.textContent = "";
            });
            elements.formStatus.textContent = "¡Gracias! Tu mensaje fue enviado correctamente.";
            elements.formStatus.className = "mensaje-estado mensaje-exito";
        } catch (error) {
            console.error("No se pudo enviar el formulario.", error);
            elements.formStatus.textContent = "No pudimos enviar el mensaje. Intentá nuevamente en unos minutos.";
            elements.formStatus.className = "mensaje-estado mensaje-error";
        } finally {
            elements.formButton.disabled = false;
            elements.formButton.textContent = "Enviar mensaje";
        }
    }

    elements.productList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-product-id]");

        if (button) {
            addToCart(button.dataset.productId);
        }
    });

    elements.cartList.addEventListener("click", (event) => {
        const control = event.target.closest("[data-action]");

        if (!control || control.dataset.action === "quantity") {
            return;
        }

        const item = cart.find((product) => product.id === control.dataset.productId);

        if (!item) {
            return;
        }

        if (control.dataset.action === "increase") {
            setQuantity(item.id, item.quantity + 1);
        } else if (control.dataset.action === "decrease") {
            setQuantity(item.id, item.quantity - 1);
        } else if (control.dataset.action === "remove") {
            removeFromCart(item.id);
        }
    });

    elements.cartList.addEventListener("change", (event) => {
        if (event.target.matches('[data-action="quantity"]')) {
            setQuantity(event.target.dataset.productId, event.target.value);
        }
    });

    elements.checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            return;
        }

        cart = [];
        updateCart();
        showCartMessage("¡Compra simulada con éxito! Gracias por elegirnos.");
    });

    elements.contactForm.addEventListener("submit", submitContactForm);
    elements.contactForm.addEventListener("blur", (event) => {
        if (event.target.matches("input, textarea")) {
            validateField(event.target);
        }
    }, true);
    elements.contactForm.addEventListener("input", (event) => {
        if (event.target.getAttribute("aria-invalid") === "true") {
            validateField(event.target);
        }
    });

    document.querySelectorAll("#menu-principal .nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            const menu = document.querySelector("#menu-principal");

            if (menu.classList.contains("show") && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });

    elements.currentYear.textContent = String(new Date().getFullYear());
    renderCart();
    fetchProducts();
})();
