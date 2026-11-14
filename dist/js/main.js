import { updateHeaderCartCount } from "./cart.js";
const modal = document.getElementById("login-modal");
const accountIcon = document.querySelector('.header__action-link[href="login.html"]');
const closeBtns = document.querySelectorAll("[data-close]");
const modalForm = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const toggleBtn = document.querySelector(".toggle-password");
const eyeIcon = document.querySelector(".icon-eye");
const eyeOffIcon = document.querySelector(".icon-eye-off");
const modalStatusDiv = document.getElementById("login-status");
if (modal && accountIcon) {
    accountIcon.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("modal_active");
        document.body.style.overflow = "hidden";
    });
    closeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            modal.classList.remove("modal_active");
            document.body.style.overflow = "";
        });
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("modal_active")) {
            modal.classList.remove("modal_active");
            document.body.style.overflow = "";
        }
    });
}
if (toggleBtn && passwordInput && eyeIcon && eyeOffIcon) {
    toggleBtn.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        eyeIcon.style.display = isPassword ? "none" : "block";
        eyeOffIcon.style.display = isPassword ? "block" : "none";
        toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
}
if (modalForm && emailInput && passwordInput && modalStatusDiv) {
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const showError = (input, errorId, message) => {
        const errorSpan = document.getElementById(errorId);
        if (errorSpan)
            errorSpan.textContent = message;
        input.classList.add("input-error");
        return false;
    };
    const clearError = (input, errorId) => {
        const errorSpan = document.getElementById(errorId);
        if (errorSpan)
            errorSpan.textContent = "";
        input.classList.remove("input-error");
    };
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;
        modalStatusDiv.textContent = "";
        modalStatusDiv.className = "login-status";
        clearError(emailInput, "login-email-error");
        if (!emailInput.value.trim()) {
            isValid = showError(emailInput, "login-email-error", "Email is required.");
        }
        else if (!validateEmail(emailInput.value)) {
            isValid = showError(emailInput, "login-email-error", "Please enter a valid email format.");
        }
        clearError(passwordInput, "login-password-error");
        if (!passwordInput.value.trim()) {
            isValid = showError(passwordInput, "login-password-error", "Password is required.");
        }
        if (isValid) {
            modalStatusDiv.textContent = "Logging in...";
            modalStatusDiv.classList.add("login-status_loading");
            setTimeout(() => {
                modalStatusDiv.textContent = "Success! You are logged in.";
                modalStatusDiv.className = "login-status login-status_success";
                modalForm.reset();
                if (eyeIcon && eyeOffIcon) {
                    passwordInput.type = "password";
                    eyeIcon.style.display = "block";
                    eyeOffIcon.style.display = "none";
                }
                setTimeout(() => {
                    if (modal) {
                        modal.classList.remove("modal_active");
                        document.body.style.overflow = "";
                        modalStatusDiv.textContent = "";
                    }
                }, 1500);
            }, 1000);
        }
    });
    emailInput.addEventListener("input", () => clearError(emailInput, "login-email-error"));
    passwordInput.addEventListener("input", () => clearError(passwordInput, "login-password-error"));
}
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderCartCount();
});
