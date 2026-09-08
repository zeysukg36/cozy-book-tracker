export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "status");

  document.body.append(toast);
  setTimeout(() => toast.remove(), 3000); 
} 