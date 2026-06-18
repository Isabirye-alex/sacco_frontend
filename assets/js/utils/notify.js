function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || (() => {
    const el = document.createElement('div');
    el.id = 'toastContainer';
    el.className = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement('div');
  toast.className = `alert alert-${type} mb-2`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showLoading(button) {
  if (!button) return;
  button.disabled = true;
  button.innerHTML = '<span class="loading"></span>';
}

function hideLoading(button, text) {
  if (!button) return;
  button.disabled = false;
  button.innerHTML = text;
}
