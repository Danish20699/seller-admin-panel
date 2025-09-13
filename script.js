// ✅ Replace with your CrudCrud API (valid only for 24 hrs)
const BASE_URL = "https://crudcrud.com/api/943f7f69171b40748ce67085f042ce73/products";

const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productList = document.getElementById("productList");
const totalValueEl = document.getElementById("totalValue");

let totalValue = 0;
let editId = null;

// Fetch products on page load
window.addEventListener("DOMContentLoaded", getProducts);

// Add or Update Product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    name: productNameInput.value.trim(),
    price: Number(productPriceInput.value),
  };

  if (!product.name || product.price <= 0) {
    alert("Enter valid name and price");
    return;
  }

  try {
    if (editId) {
      // Update product
      await axios.put(`${BASE_URL}/${editId}`, product);
      editId = null;
      productForm.querySelector("button").textContent = "Add Product";
    } else {
      // Add new product
      await axios.post(BASE_URL, product);
    }

    productForm.reset();
    getProducts();
  } catch (err) {
    console.error("Error saving product:", err);
    alert("Error saving product. Check console.");
  }
});

// Fetch all products
async function getProducts() {
  try {
    const res = await axios.get(BASE_URL);
    const products = res.data;

    productList.innerHTML = "";
    totalValue = 0;

    products.forEach((product) => {
      totalValue += Number(product.price);
      addProductToDOM(product);
    });

    totalValueEl.textContent = totalValue;
  } catch (err) {
    console.error("Error fetching products:", err);
    alert("Error fetching products. Check console.");
  }
}

// Add product card to DOM
function addProductToDOM(product) {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <strong>${product.name}</strong> - ₹${product.price}
    <div>
      <button class="edit">✏️ Edit</button>
      <button class="delete">🗑️ Delete</button>
    </div>
  `;

  div.querySelector(".edit").addEventListener("click", () => editProduct(product));
  div.querySelector(".delete").addEventListener("click", () => deleteProduct(product._id));

  productList.appendChild(div);
}

// Edit product
function editProduct(product) {
  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  editId = product._id;
  productForm.querySelector("button").textContent = "Update Product";
}

// Delete product
async function deleteProduct(id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    getProducts();
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Error deleting product. Check console.");
  }
}
