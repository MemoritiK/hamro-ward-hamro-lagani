// shared.js - Common utilities for all pages
(function () {
  "use strict";

  // ==================== GLOBAL API INSTANCE ====================
  let apiInstance = null;

  function getAPI() {
    if (!apiInstance) {
      apiInstance = new window.APIService("http://localhost:8000");
    }
    return apiInstance;
  }

  // ==================== AUTH CHECK ====================
  function checkAuth() {
    const token = localStorage.getItem("auth_token");
    const currentUser = JSON.parse(localStorage.getItem("current_user"));

    if (!token || !currentUser) {
      // Don't redirect on auth pages or index
      if (
        !window.location.pathname.includes("auth/") &&
        !window.location.pathname.includes("index.html") &&
        window.location.pathname !== "/" &&
        !window.location.pathname.endsWith(".html")
      ) {
        window.location.href = "/auth/login.html";
        return null;
      }
      return null;
    }

    return currentUser;
  }

  // ==================== ROLE CHECK ====================
  function isAdmin() {
    const user = checkAuth();
    return user ? user.admin : false;
  }

  function isVerified() {
    const user = checkAuth();
    return user ? !!user.citizenship_num : false;
  }

  function isContractorForProject(project) {
    const user = checkAuth();
    return user && project && project.contractor === user.phone;
  }

  // ==================== NAVIGATION ====================
  function setupNavigation() {
    const currentUser = checkAuth();

    // Show/hide admin links
    const adminLinks = document.querySelectorAll("[data-requires-admin]");
    adminLinks.forEach((link) => {
      link.style.display = currentUser && currentUser.admin ? "" : "none";
    });

    // Show/hide verified user links
    const verifiedLinks = document.querySelectorAll("[data-requires-verified]");
    verifiedLinks.forEach((link) => {
      const show = currentUser && currentUser.citizenship_num;
      link.style.display = show ? "" : "none";
    });

    // Show user info
    const userInfoElements = document.querySelectorAll("[data-user-info]");
    userInfoElements.forEach((element) => {
      if (currentUser) {
        const field = element.getAttribute("data-user-info");
        element.textContent = currentUser[field] || "";
      }
    });
  }

  // ==================== LOGOUT ====================
  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
    window.location.href = "/index.html";
  }

  // ==================== FORMATTING ====================
  function formatDate(dateString) {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  function getStatusBadge(status) {
    const badges = {
      pending: { emoji: "🟡", label: "Pending", class: "warning" },
      approved: { emoji: "🟢", label: "Approved", class: "success" },
      rejected: { emoji: "🔴", label: "Rejected", class: "error" },
      soon: { emoji: "🟡", label: "Soon", class: "warning" },
      ongoing: { emoji: "🟢", label: "Ongoing", class: "success" },
      completed: { emoji: "✅", label: "Completed", class: "success" },
      delayed: { emoji: "🔴", label: "Delayed", class: "error" },
      reviewed: { emoji: "🔵", label: "Reviewed", class: "secondary" },
      resolved: { emoji: "✅", label: "Resolved", class: "success" },
    };

    const badge = badges[status] || { emoji: "⚪", label: status, class: "" };
    return `<span class="${badge.class}">${badge.emoji} ${badge.label}</span>`;
  }

  // ==================== ADDITIONAL FUNCTIONS ====================

  // Check and redirect if not authenticated
  function requireAuth() {
    const token = localStorage.getItem("auth_token");
    const user = JSON.parse(localStorage.getItem("current_user"));

    if (!token || !user) {
      window.location.href = "/auth/login.html";
      return null;
    }

    return user;
  }

  // Check and redirect if not admin
  function requireAdmin() {
    const user = requireAuth();
    if (!user) return null;

    if (!user.admin) {
      alert("Admin access required");
      window.location.href = "/dashboard.html";
      return null;
    }

    return user;
 }


  // ==================== EXPOSE TO WINDOW ====================
  window.shared = {
    getAPI,
    checkAuth,
    isAdmin,
    isVerified,
    isContractorForProject,
    setupNavigation,
    logout,
    formatDate,
    formatCurrency,
    getStatusBadge,
    requireAuth,
    requireAdmin,
    navigateTo: (route) => window.Router?.navigateTo(route),
    logout: () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_user");
      window.location.href = "/index.html";
    },
  };

  // Initialize when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupNavigation();
    });
  } else {
    setupNavigation();
  }
})();