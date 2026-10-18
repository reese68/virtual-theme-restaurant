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
const myOrdersList = document.querySelector("#my-orders-list");
const myOrdersEmpty = document.querySelector("#my-orders-empty");
const clearOrdersButton = document.querySelector("#clear-orders");

const cartStorageKey = "virtual-restaurant-carts-v1";
const orderStorageKey = "virtual-restaurant-orders-v1";
const readyAfterMs = 5 * 60 * 1000;

// localStorage 只属于此设备的浏览器；不可用时仍允许本次页面正常点单。
function readSavedData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 无痕模式或本地文件可能不允许保存；本次页面仍可继续使用。
  }
}

// 每家餐厅各有一份点单清单；从浏览器恢复时，只保留菜单里仍存在的菜。
const carts = new Map();
const savedCarts = readSavedData(cartStorageKey, {});
restaurants.forEach((restaurant) => {
  const savedItems = savedCarts?.[restaurant.code];
  if (!Array.isArray(savedItems)) return;

  const cart = new Map();
  savedItems.forEach((entry) => {
    if (!Array.isArray(entry) || entry.length !== 2) return;
    const [name, quantity] = entry;
    const dish = restaurant.menu.find((item) => item.name === name);
    if (dish && Number.isInteger(quantity) && quantity > 0) cart.set(dish, quantity);
  });
  if (cart.size > 0) carts.set(restaurant.code, cart);
});

function saveCarts() {
  const data = Object.fromEntries(
    [...carts].map(([code, cart]) => [
      code,
      [...cart].map(([dish, quantity]) => [dish.name, quantity])
    ])
  );
  saveData(cartStorageKey, data);
}

const storedOrders = readSavedData(orderStorageKey, []);
let savedOrders = Array.isArray(storedOrders) ? storedOrders : [];
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
  renderOrders();

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
  dishImage.alt = `${dish.name}的照片`;

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
  saveCarts();
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
  saveCarts();
  renderCart();
}

// 进度只按下单时间模拟，不代表真实厨房状态；刷新后也能重新算出当前阶段。
function getOrderStatus(createdAt) {
  const elapsed = Math.max(0, Date.now() - createdAt);
  if (elapsed >= readyAfterMs) return "可取餐";
  if (elapsed >= 10 * 1000) return "制作中";
  return "已接单";
}

function renderOrders() {
  if (!currentRestaurant) return;

  const orders = savedOrders.filter((order) =>
    order && order.restaurantCode === currentRestaurant.code &&
    Number.isFinite(order.createdAt) && Array.isArray(order.items)
  );
  myOrdersEmpty.hidden = orders.length > 0;
  clearOrdersButton.disabled = orders.length === 0;
  myOrdersList.replaceChildren();

  orders.forEach((order) => {
    const record = document.createElement("li");
    record.className = "order-record";

    const top = document.createElement("div");
    top.className = "order-record-top";
    const code = document.createElement("strong");
    code.textContent = `取餐码 ${order.pickupCode}`;
    const status = document.createElement("span");
    status.className = "order-status";
    status.textContent = getOrderStatus(order.createdAt);
    top.append(code, status);

    const meta = document.createElement("p");
    meta.className = "order-record-meta";
    const time = new Date(order.createdAt).toLocaleString("zh-CN", {
      month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
    meta.textContent = `${time} · ${order.service} · 合计 ¥${order.total}`;

    const items = document.createElement("ul");
    items.className = "order-record-items";
    order.items.forEach((dish) => {
      const item = document.createElement("li");
      item.textContent = `${dish.name} × ${dish.quantity}`;
      items.append(item);
    });

    record.append(top, meta, items);
    myOrdersList.append(record);
  });
}

// 清空记录只影响这家餐厅、此浏览器；购物清单不受影响。
clearOrdersButton.addEventListener("click", () => {
  if (!currentRestaurant || !window.confirm("确定清空这家餐厅在此浏览器的模拟订单记录吗？")) return;
  savedOrders = savedOrders.filter((order) => order?.restaurantCode !== currentRestaurant.code);
  saveData(orderStorageKey, savedOrders);
  renderOrders();
});

document.querySelector("#new-order").addEventListener("click", () => {
  document.querySelector("#menu-title").scrollIntoView({ behavior: "smooth" });
});

// 页面开着时更新模拟进度；重新打开页面也会按时间恢复进度。
setInterval(() => {
  if (currentRestaurant && !restaurantView.hidden) renderOrders();
}, 30 * 1000);
window.addEventListener("focus", renderOrders);

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

// 提交后保存模拟订单与取餐码；不会向服务器或真实厨房发送。
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
  const order = {
    restaurantCode: currentRestaurant.code,
    pickupCode: `${String(Date.now()).slice(-4)}${Math.floor(10 + Math.random() * 90)}`,
    createdAt: Date.now(),
    service,
    total,
    items: [...cart.entries()].map(([dish, quantity]) => ({ name: dish.name, quantity }))
  };
  savedOrders.unshift(order);
  savedOrders = savedOrders.slice(0, 20); // 避免此浏览器积累无限多的演示订单。
  saveData(orderStorageKey, savedOrders);

  document.querySelector("#success-code").textContent = `取餐码 ${order.pickupCode}`;
  document.querySelector("#success-status").textContent = getOrderStatus(order.createdAt);
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
  saveCarts();
  renderCart();
  renderOrders();
  orderForm.reset();
  updateServiceFields();
  orderSuccess.showModal();
});

orderSuccess.addEventListener("close", () => {
  document.querySelector("#my-orders-title").scrollIntoView({ behavior: "smooth" });
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
