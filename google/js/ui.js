// Shared UI helpers (toasts, etc.)

let toastContainer;

export function showToast(message, type = "info", timeout = 4000) {
  if (!message) return;

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  const remove = () => {
    toast.classList.remove("toast--visible");
    toast.addEventListener(
      "transitionend",
      () => {
        toast.remove();
        if (toastContainer && toastContainer.children.length === 0) {
          toastContainer.remove();
          toastContainer = null;
        }
      },
      { once: true }
    );
  };

  const timer = setTimeout(remove, timeout);

  toast.addEventListener("click", () => {
    clearTimeout(timer);
    remove();
  });
}

