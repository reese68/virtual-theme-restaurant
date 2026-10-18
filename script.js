// 先找到页面中需要操作的元素。
const welcomeView = document.querySelector("#welcome-view");
const restaurantView = document.querySelector("#restaurant-view");
const restaurantForm = document.querySelector("#restaurant-form");
const restaurantInput = document.querySelector("#restaurant-input");
const formMessage = document.querySelector("#form-message");
const changeRestaurantButton = document.querySelector("#change-restaurant");
const dishDialog = document.querySelector("#dish-dialog");
const addToOrderButton = document.querySelector("#add-to-order");
const cartItems = document.querySelector("#cart-items");
const cartContent = document.querySelector("#cart-content");
const cartEmpty = document.querySelector("#cart-empty");
const orderForm = document.querySelector("#order-form");
const tableField = document.querySelector("#table-field");
const tableNumber = document.querySelector("#table-number");
const orderSuccess = document.querySelector("#order-success");

// 每家餐厅各有一份点单清单。刷新页面后会重新开始。
const carts = new Map();
let currentRestaurant = null;
let selectedDish = null;

// 根据营业名单自动更新首页数字和公开的餐厅名称。
const openRestaurants = restaurants.filter((restaurant) =>
  !restaurant.secret && openRestaurantCodes.includes(restaurant.code)
);
document.querySelector(".door-count").textContent = openRestaurants.length;
document.querySelector(".input-hint").textContent = openRestaurants.length
  ? `今日可选：${openRestaurants.map((restaurant) => restaurant.name).join(" · ")}`
  : "今日暂无公开营业的餐厅";

// 提交表单时，按照名称或代码查找餐厅；隐藏餐厅只接受代码。
restaurantForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const visitorInput = restaurantInput.value.trim().toLowerCase();
  const matchedRestaurant = restaurants.find((restaurant) => {
    return (
      (!restaurant.secret && restaurant.name.toLowerCase() === visitorInput) ||
      restaurant.code.toLowerCase() === visitorInput
    );
  });

  if (!matchedRestaurant) {
    formMessage.textContent = "没有找到这家餐厅，请检查名称或代码后再试。";
    restaurantInput.focus();
    return;
  }

  if (!matchedRestaurant.secret && !openRestaurantCodes.includes(matchedRestaurant.code)) {
    formMessage.textContent = "这家餐厅今日未营业，请选择今日营业的餐厅。";
    restaurantInput.focus();
    return;
  }

  formMessage.textContent = "";
  showRestaurant(matchedRestaurant);
});

// 把选中餐厅的资料显示到页面上。
function showRestaurant(restaurant) {
  currentRestaurant = restaurant;
  restaurantView.classList.toggle("is-secret", Boolean(restaurant.secret));
  document.documentElement.style.setProperty("--accent", restaurant.colors.accent);
  document.documentElement.style.setProperty("--accent-dark", restaurant.colors.dark);
  document.documentElement.style.setProperty("--accent-soft", restaurant.colors.soft);
  document.documentElement.style.setProperty("--paper", restaurant.colors.paper);

  document.querySelector("#restaurant-code").textContent = `餐厅代码 · ${restaurant.code}`;
  document.querySelector("#restaurant-theme").textContent = restaurant.theme || "";
  document.querySelector("#restaurant-name").textContent = restaurant.name;
  document.querySelector("#restaurant-description").textContent = restaurant.description;
  document.querySelector("#menu-title").textContent = restaurant.secret ? "Special menu" : "今日菜单";

  const menuList = document.querySelector("#menu-list");
  menuList.innerHTML = "";

  restaurant.menu.forEach((dish) => {
    const menuItem = document.createElement("button");
    menuItem.className = "menu-item";
    menuItem.type = "button";
    menuItem.setAttribute("aria-label", `查看${dish.name}的详情`);

    const dishName = document.createElement("h4");
    dishName.textContent = dish.name;

    const price = document.createElement("span");
    price.className = "menu-price";
    price.textContent = `¥${dish.price}`;

    menuItem.append(dishName, price);
    menuItem.addEventListener("click", () => showDishDetails(dish, restaurant));
    menuList.append(menuItem);
  });

  orderForm.reset();
  updateServiceFields();
  renderCart();

  welcomeView.hidden = true;
  restaurantView.hidden = false;
  document.title = `${restaurant.name}｜虚拟主题餐厅`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 点击菜品后，把简介、厨师和图片放进详情弹窗。
function showDishDetails(dish, restaurant) {
  selectedDish = dish;
  const dishImage = document.querySelector("#dish-image");
  dishImage.src = dish.image;
  dishImage.alt = `${dish.name}的主题插画`;

  document.querySelector("#dish-restaurant").textContent = restaurant.name;
  document.querySelector("#dish-name").textContent = dish.name;
  document.querySelector("#dish-price").textContent = `¥${dish.price}`;
  document.querySelector("#dish-description").textContent = dish.description;
  document.querySelector("#dish-chef").textContent = dish.chef;

  dishDialog.showModal();
}

// 点击“加入点单”时，给这道菜增加一份。
addToOrderButton.addEventListener("click", () => {
  if (!currentRestaurant || !selectedDish) return;

  const cart = getCurrentCart();
  cart.set(selectedDish, (cart.get(selectedDish) || 0) + 1);
  renderCart();
  dishDialog.close();
  document.querySelector("#order-section").scrollIntoView({ behavior: "smooth" });
});

function getCurrentCart() {
  if (!carts.has(currentRestaurant.code)) {
    carts.set(currentRestaurant.code, new Map());
  }
  return carts.get(currentRestaurant.code);
}

// 用当前清单重新绘制菜品、数量和总价。
function renderCart() {
  const cart = getCurrentCart();
  const itemCount = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = [...cart.entries()].reduce((sum, [dish, quantity]) => sum + dish.price * quantity, 0);

  document.querySelector("#cart-count").textContent = `${itemCount} 份菜品`;
  document.querySelector("#cart-total").textContent = `¥${total}`;
  cartEmpty.hidden = itemCount > 0;
  cartContent.hidden = itemCount === 0;
  cartItems.replaceChildren();

  cart.forEach((quantity, dish) => {
    const row = document.createElement("li");
    row.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";
    const name = document.createElement("strong");
    name.textContent = dish.name;
    const unitPrice = document.createElement("small");
    unitPrice.textContent = `单价 ¥${dish.price}`;
    info.append(name, unitPrice);

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `减少${dish.name}数量`);
    decrease.addEventListener("click", () => changeQuantity(dish, -1));
    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;
    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `增加${dish.name}数量`);
    increase.addEventListener("click", () => changeQuantity(dish, 1));
    quantityControls.append(decrease, quantityText, increase);

    const lineTotal = document.createElement("strong");
    lineTotal.className = "cart-line-total";
    lineTotal.textContent = `¥${dish.price * quantity}`;
    row.append(info, quantityControls, lineTotal);
    cartItems.append(row);
  });
}

function changeQuantity(dish, amount) {
  const cart = getCurrentCart();
  const nextQuantity = (cart.get(dish) || 0) + amount;
  if (nextQuantity <= 0) {
    cart.delete(dish);
  } else {
    cart.set(dish, nextQuantity);
  }
  renderCart();
}

// 自取不需要填写桌号；堂食则必须填写。
function updateServiceFields() {
  const isDineIn = orderForm.querySelector('input[name="service"]:checked').value === "dine-in";
  tableField.hidden = !isDineIn;
  tableNumber.required = isDineIn;
  tableNumber.setCustomValidity("");
}

orderForm.querySelectorAll('input[name="service"]').forEach((radio) => {
  radio.addEventListener("change", updateServiceFields);
});
tableNumber.addEventListener("input", () => tableNumber.setCustomValidity(""));

document.querySelector("#continue-order").addEventListener("click", () => {
  document.querySelector("#menu-title").scrollIntoView({ behavior: "smooth" });
});

// 这里只生成浏览器中的演示回执，没有向服务器发送订单。
orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cart = getCurrentCart();
  if (cart.size === 0) return;

  const isDineIn = orderForm.querySelector('input[name="service"]:checked').value === "dine-in";
  const table = tableNumber.value.trim();
  if (isDineIn && !table) {
    tableNumber.setCustomValidity("请输入桌号");
    tableNumber.reportValidity();
    return;
  }

  const itemCount = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = [...cart.entries()].reduce((sum, [dish, quantity]) => sum + dish.price * quantity, 0);
  const service = isDineIn ? `堂食 · ${table} 号桌` : "自取";
  document.querySelector("#success-summary").textContent =
    `${currentRestaurant.name} · ${itemCount} 份菜品 · 合计 ¥${total} · ${service}`;

  const successItems = document.querySelector("#success-items");
  successItems.replaceChildren();
  cart.forEach((quantity, dish) => {
    const item = document.createElement("li");
    item.textContent = `${dish.name} × ${quantity} · ¥${dish.price * quantity}`;
    successItems.append(item);
  });

  cart.clear();
  renderCart();
  orderForm.reset();
  updateServiceFields();
  orderSuccess.showModal();
});

orderSuccess.addEventListener("close", () => {
  document.querySelector("#menu-title").scrollIntoView({ behavior: "smooth" });
});

// 点击“更换餐厅”后回到初始画面。
changeRestaurantButton.addEventListener("click", () => {
  restaurantView.hidden = true;
  welcomeView.hidden = false;
  restaurantInput.value = "";
  document.title = "主题餐厅";
  restaurantInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
