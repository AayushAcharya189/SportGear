// ===================================
// Auth & Role Setup (MUST BE FIRST)
// ===================================

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = user.role?.toLowerCase() === "admin";
const currentPage = window.location.pathname;

// Auto-fill ID from URL if present (e.g., update.html?id=123)
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const idInput = document.getElementById('gearId'); // Used in update.html and delete.html
    if (id && idInput) {
        idInput.value = id;
    }
});

// --- DYNAMIC NAVIGATION CONTROL ---
document.querySelectorAll("nav ul li a").forEach((link) => {
    const href = link.getAttribute("href");

    // 1. Hide Admin-only links (Inventory & Admin Orders)
    const isAdminLink = href.includes("inventory.html") || 
                        href.includes("admin-orders.html") || 
                        href.includes("add.html") || 
                        href.includes("update.html") || 
                        href.includes("delete.html");

    if (isAdminLink && !isAdmin) {
        link.parentElement.style.display = "none";
    }

    // 2. Hide Profile link if NOT logged in
    if (href.includes("profile.html") && !token) {
        link.parentElement.style.display = "none";
    }

    // 3. Hide Login link if ALREADY logged in
    if (href.includes("login.html") && token) {
        link.parentElement.style.display = "none";
    }
});

// --- PAGE ACCESS PROTECTION ---

// Admin-only pages
const adminOnlyPages = ["add.html", "update.html", "delete.html", "inventory.html", "admin-orders.html"];

// Protect restricted pages
if (adminOnlyPages.some(page => currentPage.endsWith(page))) {
    if (!token) {
        // Redirect to login if no token exists
        window.location.href = "login.html";
    } else if (!isAdmin) {
        // Redirect to home if user is logged in but not an admin
        alert("Access Denied: Administrator privileges required.");
        window.location.href = "index.html";
    }
}

// ===========================
// Utilities
// ===========================

/**
 * Get input value safely and trim whitespace.
 */
const getVal = (id) =>
  document.getElementById(id)?.value.trim() || "";

/**
 * Display status/error messages on the page.
 * Matches the .status-message class in our CSS.
 */
function setStatus(id, message, color = "red") {
  const el = document.getElementById(id);
  if (el) {
    el.style.color = color;
    el.innerText = message;
    // If message is empty, hide the element to keep the layout clean
    el.style.display = message ? "block" : "none";
  }
}

/**
 * Standardized popup alert for important notifications.
 */
function showAlert(message) {
  alert(message);
}

/**
 * Simple Regex for email format validation.
 */
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

/**
 * Password validation: 
 * - At least 8 characters
 * - One uppercase & one lowercase letter
 * - One number
 * - One special character (@$!%*?&)
 */
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

// ===========================
// General Page Protection
// ===========================

/**
 * protectedPages: Pages that require ANY logged-in user (Customer or Admin).
 * adminOnlyPages was handled in Section 1, but we list them here to ensure 
 * a guest can't even see the skeleton of the page.
 */
const protectedPages = ["profile.html", "add.html", "update.html", "delete.html", "inventory.html", "admin-orders.html"];

if (protectedPages.some(page => currentPage.endsWith(page))) {
    // If there is no token, they aren't logged in at all
    if (!token) {
        showAlert("Please login to access your account and gear management.");
        window.location.href = "login.html";
    } 
    // Note: Admin-specific checks are handled in Section 1 to prevent 
    // customers from accessing admin-only pages.
}

// ===========================
// Navbar Logout Button
// ===========================

const navMenu = document.querySelector("nav ul");

/**
 * If the user is logged in (token exists), dynamically append
 * a logout button to the end of the navigation list.
 */
if (navMenu && token) {
  const logoutItem = document.createElement("li");
  
  // Added CSS classes to match your modular button styles
  logoutItem.innerHTML = `<button id="logoutBtn" class="btn btn-sm danger">Logout</button>`;
  navMenu.appendChild(logoutItem);

  document.getElementById("logoutBtn").addEventListener("click", () => {
    // 1. Clear sensitive user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // 2. Clear cart (Recommended for security/privacy)
    localStorage.removeItem("cart");

    // 3. Redirect to login page
    window.location.href = "login.html";
  });
}

// ======================================
// Authentication (Login & Registration)
// ======================================

/**
 * Handles both Login and Registration forms.
 * @param {string} formId - ID of the form element.
 * @param {string} url - API endpoint URL.
 * @param {string} statusId - ID of the paragraph to display messages.
 * @param {string} redirectOnSuccess - URL to redirect to after success.
 */
async function handleAuth(formId, url, statusId, redirectOnSuccess = null) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Collect inputs based on the IDs used in your HTML
    const name = getVal("registerFullName");
    const email = getVal("loginEmail") || getVal("registerEmail");
    const password = getVal("loginPassword") || getVal("registerPassword");
    const confirmPassword = getVal("registerConfirmPassword");

    const submitBtn = form.querySelector('button[type="submit"]');

    // 2. Basic Validation
    if (!email || !password) {
      return setStatus(statusId, "Please fill out all fields.");
    }

    if (formId === "registerForm") {
      if (!name || !confirmPassword) {
        return setStatus(statusId, "Please fill out all fields.");
      }
      if (password !== confirmPassword) {
        return setStatus(statusId, "Passwords do not match.");
      }
      if (!isStrongPassword(password)) {
        return setStatus(
          statusId,
          "Password must be 8+ chars with upper, lower, number, and special char."
        );
      }
    }

    if (!isValidEmail(email)) {
      return setStatus(statusId, "Invalid email address.");
    }

    // 3. Prepare Payload
    const payload = formId === "registerForm"
        ? { username: name, email, password }
        : { email, password };

    try {
      // Disable button and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = formId === "registerForm" ? "Register" : "Login";
        }
        return setStatus(statusId, data.message || "Operation failed.");
      }

      // 4. Handle Success
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setStatus(
        statusId,
        formId === "registerForm" ? "Registration successful!" : "Login successful!",
        "green"
      );

      // Redirect after a short delay so user can see the success message
      if (redirectOnSuccess) {
        setTimeout(() => {
          window.location.href = redirectOnSuccess;
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setStatus(statusId, "Network error. Is the server running?");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = formId === "registerForm" ? "Register" : "Login";
      }
    }
  });
}

// --- Initialize authentication logic ---

// Login logic
handleAuth(
  "loginForm",
  "http://localhost:5000/api/auth/login",
  "loginStatus",
  "index.html"
);

// Registration logic
handleAuth(
  "registerForm",
  "http://localhost:5000/api/auth/register",
  "registerStatus",
  "login.html"
);

// ====================================
// Gear Management (Add / Update / Delete)
// ====================================

/**
 * Validates the gear object before sending it to the API.
 */
function validateGear(gear, requireId = false, deleteOnly = false) {
    if (requireId && !gear._id) return false;
    if (deleteOnly) return true;

    // Check numbers first (Price and Quantity are always required)
    const isPriceValid = !isNaN(gear.price) && gear.price > 0;
    const isQuantityValid = !isNaN(gear.quantity) && gear.quantity >= 0;

    // If requireId is true, it's an UPDATE: Name can be empty
    if (requireId) {
        return isPriceValid && isQuantityValid;
    }

    // If requireId is false, it's an ADD: Name and Category are mandatory
    return gear.name && gear.category && isPriceValid && isQuantityValid;
}

/**
 * Generic handler for Add, Update, and Delete gear forms.
 */
function gearFormHandler(formId, method, urlBuilder, requireId = false, deleteOnly = false) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Security check
        if (!token || !isAdmin) {
            return showAlert("Access Denied: Only admins can manage gear.");
        }

        const submitBtn = form.querySelector('button[type="submit"]');

        const gear = {
            _id: getVal("gearId"),
            name: getVal("name"),
            category: getVal("category"),
            price: Number(getVal("price")),
            quantity: Number(getVal("quantity")),
            image: getVal("image"),
        };

        // If no new image URL is provided, remove it so MongoDB keeps the old one
        if (!gear.image) {
            delete gear.image;
        }

        // Validate data
        if (!validateGear(gear, requireId, deleteOnly)) {
            return showAlert("Please fill out all required fields correctly.");
        }

        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Processing...";
            }

            const res = await fetch(urlBuilder(gear._id), {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: method !== "DELETE" ? JSON.stringify(gear) : undefined,
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || data.message || "Operation failed.");
            }

            showAlert(`${method === "POST" ? "Added" : method === "PUT" ? "Updated" : "Deleted"} successfully!`);
            form.reset();

            // Redirect to inventory to see the changes
            setTimeout(() => {
                window.location.href = "inventory.html";
            }, 1000);

        } catch (err) {
            showAlert(err.message);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit";
            }
        }
    });
}

// --- Initialize Handlers ---

// Add Gear (add.html)
gearFormHandler("addForm", "POST", () => "http://localhost:5000/api/gears");

// Update Gear (update.html)
gearFormHandler("updateForm", "PUT", id => `http://localhost:5000/api/gears/${id}`, true);

// Delete Gear (delete.html)
gearFormHandler("deleteForm", "DELETE", id => `http://localhost:5000/api/gears/${id}`, true, true);

// ===========================
// Inventory Page
// ===========================

const inventoryList = document.getElementById("inventoryList");

// --- FALLBACK DATA ---
const dummyGears = [
  { _id: "1", name: "Sample Waterproof Tent", category: "Camping", price: 120, quantity: 10, image: "../assets/images/waterprooftent.jpg" },
  { _id: "2", name: "Sample Hiking Boots", category: "Hiking", price: 90, quantity: 5, image: "../assets/images/snowboots.jpg" },
  { _id: "3", name: "Sample Kayak Paddle", category: "Kayaking", price: 60, quantity: 8, image: "../assets/images/kayak.jpg" },
];

let allInventory = []; // Master list to store live or dummy data for filtering

if (inventoryList) {
  // 1. Fetch live gear data from the server
  fetch("http://localhost:5000/api/gears")
    .then(res => res.json())
    .then(res => {
      allInventory = res.data; 
      renderInventory(allInventory);
    }) 
    .catch(() => {
      console.warn("Backend unreachable. Loading dummy data for UI preview.");
      allInventory = dummyGears; // Use dummy data if fetch fails
      renderInventory(allInventory);
    });

  // 2. SEARCH & FILTER LOGIC
  const filterInventory = () => {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const selectedCategory = document.getElementById("categoryFilter")?.value || "all";

    const filtered = allInventory.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === "all" || g.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    renderInventory(filtered);
  };

  // 3. ATTACH LISTENERS
  document.getElementById("searchInput")?.addEventListener("input", filterInventory);
  document.getElementById("categoryFilter")?.addEventListener("change", filterInventory);

  /**
   * Renders the gear cards into the inventory grid.
   */
  function renderInventory(data) {
    const gears = Array.isArray(data) ? data : [];

    if (gears.length === 0) {
      inventoryList.innerHTML = "<p class='empty-message'>No gear matches your search.</p>";
      return;
    }

    inventoryList.innerHTML = gears.map(g => {
      const isLowStock = g.quantity > 0 && g.quantity < 5;
      const isOutOfStock = g.quantity === 0;
      const stockClass = isOutOfStock ? 'status-out' : (isLowStock ? 'status-low' : 'status-ok');
      const gearImg = g.image || "../assets/images/placeholder.jpg";
    
      return `
        <div class="gear-card">
          <div class="gear-card__img-container">
            <img src="${gearImg}" alt="${g.name}" class="gear-image" onerror="this.src='../assets/images/placeholder.jpg'" />
          </div>
          <div class="gear-card__info">
            <h3>${g.name}</h3>
            <p><strong>Category:</strong> ${g.category}</p>
            <p><strong>Price:</strong> $${Number(g.price).toFixed(2)}</p>
          
            <p class="stock-status ${stockClass}">
              <strong>Quantity:</strong> ${g.quantity}
              ${isLowStock ? '<br><span class="warning-tag">⚠️ Low Stock</span>' : ''}
              ${isOutOfStock ? '<br><span class="warning-tag">❌ Out of Stock</span>' : ''}
            </p>
          
            <p><small class="id-text"><strong>ID:</strong> ${g._id}</small></p>
          
            <div class="admin-actions">
              <button class="btn btn-sm btn--edit" onclick="location.href='update.html?id=${g._id}'">Edit</button>
              <button class="btn btn-sm danger btn--delete" onclick="location.href='delete.html?id=${g._id}'">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}

// ===========================
// Product & Cart Management
// ===========================

const productGallery = document.getElementById("productGallery");
let allProducts = []; // Master list from DB

if (productGallery) {
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // --- CHECKOUT LOGIC ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cartKeys = Object.keys(cart);

      if (cartKeys.length === 0) return showAlert("Your cart is empty!");
      if (!token) {
        showAlert("Please login to complete your purchase.");
        window.location.href = "login.html";
        return;
      }

      // Format payload for Backend Order Schema
      let totalAmount = 0;
      const itemsArray = cartKeys.map(id => {
        const item = cart[id];
        totalAmount += item.price * item.quantity;
        return {
          product: id, 
          name: item.name,
          quantity: item.quantity,
          price: item.price
        };
      });

      try {
        checkoutBtn.disabled = true;
        checkoutBtn.innerText = "Processing Order...";

        const response = await fetch("http://localhost:5000/api/orders/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ items: itemsArray, totalAmount })
        });

        const result = await response.json();

        if (response.ok) {
          showAlert("Order placed successfully! Redirecting to profile...");
          cart = {};
          localStorage.removeItem("cart");
          updateCartUI();
          setTimeout(() => { window.location.href = "profile.html"; }, 1500);
        } else {
          throw new Error(result.message || "Checkout failed");
        }
      } catch (error) {
        showAlert(error.message);
        checkoutBtn.disabled = false;
        checkoutBtn.innerText = "Checkout";
      }
    });
  }

  // --- SEARCH & FILTER LOGIC ---
  const filterProducts = () => {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const selectedCategory = document.getElementById("categoryFilter")?.value || "all";

    const filtered = allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    renderProducts(filtered);
  };

  document.getElementById("searchInput")?.addEventListener("input", filterProducts);
  document.getElementById("categoryFilter")?.addEventListener("change", filterProducts);

  // --- CART UI LOGIC ---
  const updateCartUI = () => {
    if (!cartItems) return;
    cartItems.innerHTML = "";
    const ids = Object.keys(cart);

    if (!ids.length) {
      cartItems.innerHTML = "<p class='empty-cart-msg'>Your cart is empty.</p>";
      cartTotal.textContent = "Total: $0.00";
      if (checkoutBtn) checkoutBtn.style.display = "inline-block";
      return;
    }

    let total = 0;
    ids.forEach(id => {
      const item = cart[id];
      const subtotal = item.price * item.quantity;
      total += subtotal;
      cartItems.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.name}</strong><br>
            <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
          </div>
          <div class="cart-item-actions">
            <span>$${subtotal.toFixed(2)}</span>
            <button class="remove-btn" data-id="${id}">Remove</button>
          </div>
        </div>
      `;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    if (checkoutBtn) {
      checkoutBtn.style.display = "inline-block";
      checkoutBtn.disabled = false;
    }

    // Attach Remove Event
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        cart[id].quantity--;
        if (cart[id].quantity <= 0) delete cart[id];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
      };
    });
  };

  const addToCart = (product) => {
    // Stock Check
    const currentQtyInCart = cart[product._id]?.quantity || 0;
    if (currentQtyInCart >= product.quantity) {
      return showAlert("Sorry, no more stock available for this item.");
    }

    if (cart[product._id]) cart[product._id].quantity++;
    else cart[product._id] = { ...product, quantity: 1 };
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  };

  // --- INITIAL DATA FETCH ---
  fetch("http://localhost:5000/api/gears")
    .then(res => res.json())
    .then(res => {
      allProducts = res.data;
      renderProducts(allProducts);
    })
    .catch(() => {
      allProducts = dummyGears; 
      renderProducts(allProducts);
    });

  function renderProducts(products) {
    if (products.length === 0) {
      productGallery.innerHTML = `<p class="no-results">No gear matches your search.</p>`;
      return;
    }

    productGallery.innerHTML = products.map(p => {
      const isOutOfStock = p.quantity <= 0;
      return `
        <div class="product-card">
          <div class="product-img-frame">
            <img src="${p.image || '../assets/images/placeholder.jpg'}" 
             alt="${p.name}"
             onerror="this.onerror=null; this.src='../assets/images/placeholder.jpg';" 
            />
          </div>
          <h3>${p.name}</h3>
          <p class="category-tag">${p.category}</p>
          <p class="price-tag">$${Number(p.price).toFixed(2)}</p>
          <p class="stock-tag ${isOutOfStock ? 'text-red' : ''}">
            Stock: ${isOutOfStock ? 'Sold Out' : p.quantity}
          </p>
          ${!isAdmin ? `
            <button class="btn add-to-cart-btn" data-id="${p._id}" ${isOutOfStock ? 'disabled' : ''}>
              ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          ` : ''}
        </div>
      `;
    }).join("");

    // Re-attach listeners
    if (!isAdmin) {
      document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.onclick = () => {
          const product = allProducts.find(p => p._id === btn.dataset.id);
          if (product) addToCart(product);
        };
      });
    } else {
      const cartSection = document.getElementById("cartSection");
      if (cartSection) cartSection.style.display = "none";
    }
    updateCartUI();
  }
}

// ===========================
// Contact Form
// ===========================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Collect values
        const contact = {
            name: getVal("contactName"), // Updated ID to match potential HTML uniqueness
            email: getVal("contactEmail"),
            message: getVal("contactMessage"),
        };

        const statusId = "contactStatus";
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // 2. Validation
        if (!contact.name || !contact.email || !contact.message) {
            return setStatus(statusId, "All fields are required.");
        }

        if (!isValidEmail(contact.email)) {
            return setStatus(statusId, "Invalid email address.");
        }

        // 3. API Submission
        try {
            // Disable button during network request
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Sending...";
            }

            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            // 4. Success Handling
            setStatus(statusId, data.message || "Thanks for contacting us! We'll reply soon.", "green");
            contactForm.reset();
            
            // Re-enable button after short delay
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Send Message";
                }
            }, 3000);

        } catch (err) {
            setStatus(statusId, err.message);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
            }
        }
    });
}

// ===========================
// Profile Page Logic
// ===========================
const profileDisplay = document.getElementById("profileDisplay");

if (profileDisplay) {
  // 1. Guard: Ensure only logged-in users see this
  if (!token) {
    window.location.href = "login.html";
  } else {
    const role = (user.role || "user").toLowerCase();

    // 2. Render Profile View & Edit UI
    profileDisplay.innerHTML = `
      <div class="profile-card">
        <div id="viewMode" class="profile-view-container">
          <h2>Welcome, <span id="displayName">${user.username || "Member"}</span>!</h2>
          <p><strong>Email:</strong> <span id="displayEmail">${user.email || "No email"}</span></p>
          <p><strong>Account Type:</strong> 
            <span class="role-badge ${role === 'admin' ? 'admin-role' : 'user-role'}">
              ${role.toUpperCase()}
            </span>
          </p>
          <div class="profile-actions">
            <button id="editBtn" class="btn btn-sm">Edit Profile Settings</button>
          </div>
        </div>

        <div id="editMode" style="display: none;" class="profile-edit-container">
          <h2>Edit Profile</h2>
          <div class="form-group">
            <label>Username:</label>
            <input type="text" id="editUsername" class="form-control" value="${user.username || ''}">
          </div>
          <div class="form-group">
            <label>Email Address:</label>
            <input type="email" id="editEmail" class="form-control" value="${user.email || ''}">
          </div>
          <div class="edit-buttons">
            <button id="saveBtn" class="btn btn--success">Save Changes</button>
            <button id="cancelBtn" class="btn btn--danger">Cancel</button>
          </div>
        </div>
      </div>
    `;

    const viewMode = document.getElementById("viewMode");
    const editMode = document.getElementById("editMode");

    // Toggle Modes
    document.getElementById("editBtn").onclick = () => {
      viewMode.style.display = "none";
      editMode.style.display = "block";
    };

    document.getElementById("cancelBtn").onclick = () => {
      viewMode.style.display = "block";
      editMode.style.display = "none";
    };

    // Save Logic
    document.getElementById("saveBtn").onclick = async () => {
      const nameInput = document.getElementById("editUsername").value.trim();
      const emailInput = document.getElementById("editEmail").value.trim();

      // If you want to allow them to leave it blank to "keep old data", 
      // we check if they typed something. If not, we use the original user object data.
      const updatedData = {
        username: nameInput || user.username, 
        email: emailInput || user.email,
      };
      try {
        const response = await fetch(`http://localhost:5000/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
          // Merge the changes into your local user object
          const newUserObj = { ...user, ...updatedData };
          localStorage.setItem("user", JSON.stringify(newUserObj));
      
          showAlert("Profile updated successfully!");
      
          // Delay reload slightly so user can see the alert
          setTimeout(() => location.reload(), 1000); 
        } else {
          showAlert(result.message || "Update failed.");
        }
      } catch (error) {
        showAlert("Connection error. Could not save profile.");
      }
    };

    // 3. Order History Logic
    const orderHistoryContainer = document.getElementById("orderHistoryContainer");

    if (orderHistoryContainer) {
      const fetchOrders = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/orders/myorders", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const result = await res.json();

          if (res.ok && result.data.length > 0) {
            orderHistoryContainer.innerHTML = result.data.map(order => {
              const statusClass = (order.status || 'pending').toLowerCase();
              const orderDate = new Date(order.createdAt).toLocaleDateString();
              const orderIdShort = order._id.slice(-6).toUpperCase();

              return `
                <div class="order-item">
                  <div class="order-item__header">
                    <strong>Order #${orderIdShort}</strong>
                    <span class="status-pill status-pill--${statusClass}">
                      ${(order.status || 'PENDING').toUpperCase()}
                    </span>
                  </div>
                  <div class="order-item__body">
                    <p><strong>Date:</strong> ${orderDate}</p>
                    <p><strong>Total Paid:</strong> $${order.totalAmount.toFixed(2)}</p>
                    <div class="order-item__details-box">
                      <p class="order-item__subtitle">Items Purchased:</p>
                      <ul class="order-item__list">
                        ${order.items.map(item => `<li>${item.name} <span class="text-muted">(x${item.quantity})</span></li>`).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              `;
            }).join('');
          } else {
            orderHistoryContainer.innerHTML = `
              <div class="empty-state">
                <p>You haven't placed any orders yet.</p>
                <a href="index.html" class="btn btn-sm">Start Shopping</a>
              </div>`;
          }
        } catch (error) {
          orderHistoryContainer.innerHTML = "<p class='error-text'>Unable to load your order history at this time.</p>";
        }
      };
      fetchOrders();
    }
  }
}

// ======================================
// Global Order Management (Admin Only) 
// ======================================
const adminOrderList = document.getElementById("adminOrderList");
let allOrders = [];

if (adminOrderList) {
    const fetchAllOrders = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/orders/all", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const result = await res.json();

            if (result.success) {
                // Sort by newest first
                allOrders = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                renderOrders(allOrders);
                updateStats(allOrders);
            }
        } catch (error) {
            console.error("Admin Fetch Error:", error);
            adminOrderList.innerHTML = "<p class='error-message'>Error loading orders. Check server connection.</p>";
        }
    };

    // --- ADMIN SEARCH LOGIC ---
    const searchInput = document.getElementById("adminSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allOrders.filter(order => {
                const customerName = (order.user?.username || order.user?.name || "").toLowerCase();
                const orderId = order._id.toLowerCase();
                return customerName.includes(searchTerm) || orderId.includes(searchTerm);
            });
            renderOrders(filtered);
            updateStats(filtered);
        });
    }
    fetchAllOrders();
}

/**
 * Updates the Dashboard Stat Cards
 */
function updateStats(orders) {
    const deliveredOrders = orders.filter(o => o.status?.toUpperCase() === 'DELIVERED');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const revEl = document.getElementById("totalRevenue");
    const countEl = document.getElementById("totalOrders");
    
    if (revEl) revEl.innerText = `$${totalRevenue.toFixed(2)}`;
    if (countEl) countEl.innerText = deliveredOrders.length;
}

/**
 * Renders the list of all customer orders
 */
function renderOrders(ordersToRender) {
    const listContainer = document.getElementById("adminOrderList");
    if (!listContainer) return;

    if (ordersToRender.length === 0) {
        listContainer.innerHTML = "<p class='empty-state'>No orders found.</p>";
        return;
    }

    listContainer.innerHTML = ordersToRender.map(order => {
        const formattedDate = new Date(order.createdAt).toLocaleString();
        const statusClass = (order.status || 'pending').toLowerCase();

        return `
        <div class="order-card admin-view">
            <div class="order-item__header">
                <div>
                    <h3 class="order-id-title">Order #${order._id.slice(-6).toUpperCase()}</h3>
                    <small class="text-muted">Placed: ${formattedDate}</small>
                </div>
                <span class="status-pill status-pill--${statusClass}">
                    ${order.status || 'PENDING'}
                </span>
            </div>
            
            <div class="admin-order-info">
                <p><strong>Customer:</strong> ${order.user?.username || 'Guest'}</p>
                <p><strong>Email:</strong> ${order.user?.email || 'N/A'}</p>
                <p><strong>Total Amount:</strong> $${(order.totalAmount || 0).toFixed(2)}</p>
            </div>

            <div class="order-items-list">
                <strong>Items:</strong>
                <ul>
                    ${order.items.map(i => {
                        const stock = i.product?.quantity ?? "N/A";
                        const lowStockWarning = (typeof stock === 'number' && stock < 5);
                        return `
                            <li>
                                ${i.name} (Qty: ${i.quantity})
                                ${lowStockWarning ? `<span class="warning-tag">⚠️ Stock: ${stock}</span>` : ''}
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div> 

            <div class="admin-actions">
                ${order.status?.toUpperCase() === 'PENDING' 
                    ? `<button class="btn btn-sm success" onclick="window.updateOrderStatus('${order._id}', 'SHIPPED')">Ship Order</button>` 
                    : order.status?.toUpperCase() === 'SHIPPED'
                        ? `<button class="btn btn-sm btn-deliver" onclick="window.updateOrderStatus('${order._id}', 'DELIVERED')">Mark Delivered</button>`
                        : `<span class="completed-text">✅ Processed</span>`
                }
                <button class="btn btn-sm btn--danger" onclick="window.deleteOrder('${order._id}')">Delete</button>
            </div>
        </div> `;
    }).join('');
}

// --- ATTACH TO WINDOW FOR INLINE HTML ONCLICK ---

window.updateOrderStatus = async (orderId, newStatus) => {
    if (!confirm(`Mark order as ${newStatus}?`)) return;
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) location.reload();
    } catch (err) { console.error(err); }
};

window.deleteOrder = async (orderId) => {
    if (!confirm("⚠️ Permanently delete this order?")) return;
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            showAlert("Order removed.");
            location.reload();
        }
    } catch (err) { console.error(err); }
};

// ===========================
// Hamburger: Menu Toggle
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('nav-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
    
    // Optional: Animate hamburger to an 'X'
    hamburger.classList.toggle('active');
  });
}

// To close menu automatically when a user clicks a link
document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const mobileMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });
});