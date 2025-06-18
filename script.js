document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-bar");
  const cards = document.querySelectorAll(".card");
  const cartCount = document.getElementById("cartCount");
  const cartBtn = document.querySelector(".cart-btn");
  const cartSidebar = document.getElementById("cartSidebar");
  const closeCart = document.getElementById("closeCart");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const overlay = document.getElementById("overlay");

  let cart = {};

  function updateCartDisplay() {
    let totalQty = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalQty;
  }

  function applySearchFilter() {
    const searchText = searchInput.value.trim().toLowerCase();

    cards.forEach(card => {
      const cardTitle = card.querySelector("h4").textContent.toLowerCase();
      const searchMatch = cardTitle.includes(searchText);
      card.style.display = searchMatch ? "flex" : "none";
    });
  }

  function setupCartActions(card) {
    const addBtn = card.querySelector(".add-btn");
    const qtyControls = card.querySelector(".qty-controls");
    const qtyValue = card.querySelector(".qty-value");
    const title = card.querySelector("h4").textContent;
    const productId = card.getAttribute("data-id");
    const imageSrc = card.querySelector("img").getAttribute("src");
    const priceText = card.querySelector("p").textContent.match(/₹ (\d+)/);
    const price = priceText ? parseInt(priceText[1]) : 0;

    addBtn.addEventListener("click", () => {
      qtyControls.style.display = "flex";
      addBtn.style.display = "none";
      cart[productId] = { title, qty: 1, price, image: imageSrc };
      qtyValue.textContent = "1";
      updateCartDisplay();
    });

    const minusBtn = card.querySelector(".qty-minus");
    const plusBtn = card.querySelector(".qty-plus");

    minusBtn.addEventListener("click", () => {
      if (cart[productId] && cart[productId].qty > 1) {
        cart[productId].qty--;
        qtyValue.textContent = cart[productId].qty;
      } else {
        delete cart[productId];
        qtyControls.style.display = "none";
        addBtn.style.display = "block";
      }
      updateCartDisplay();
    });

    plusBtn.addEventListener("click", () => {
      if (!cart[productId]) {
        cart[productId] = { title, qty: 1, price, image: imageSrc };
      }
      cart[productId].qty++;
      qtyValue.textContent = cart[productId].qty;
      updateCartDisplay();
    });
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    Object.values(cart).forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      const itemTotal = item.qty * item.price;
      total += itemTotal;

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="item-details">
          <div class="item-name">${item.title}</div>
          <small>Qty: ${item.qty}</small>
          <small>Price: ₹${item.price}</small>
          <small>Subtotal: ₹${itemTotal}</small>
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });

    cartTotal.textContent = total;
  }

  cartBtn.addEventListener("click", () => {
    renderCartItems();
    cartSidebar.classList.add("open");
    overlay.classList.add("show");
  });

  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  searchInput.addEventListener("input", applySearchFilter);
  cards.forEach(setupCartActions);

  console.log("Cart initialized.");
});
