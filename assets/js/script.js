/**
 * SCRIPT UTAMA - FUNGSI UMUM SISTEM
 * 
 * Berisi semua fungsi dasar yang digunakan di seluruh halaman
 */

// Inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
  initSidebarToggle();
  initTooltips();
  initDataTables();
  initDeleteButtons();
  initFormsValidation();
  initPasswordToggle();
});

// Fungsi toggle sidebar
function initSidebarToggle() {
  const sidebarCollapse = document.getElementById('sidebarCollapse');
  if (sidebarCollapse) {
    sidebarCollapse.addEventListener('click', function() {
      document.getElementById('sidebar').classList.toggle('active');
      document.getElementById('content').classList.toggle('active');
      
      // Simpan state sidebar di localStorage
      const isActive = document.getElementById('sidebar').classList.contains('active');
      localStorage.setItem('sidebarActive', isActive ? 'false' : 'true');
    });
    
    // Load state sidebar dari localStorage
    if (localStorage.getItem('sidebarActive') === 'false') {
      document.getElementById('sidebar').classList.add('active');
      document.getElementById('content').classList.add('active');
    }
  }
}

// Inisialisasi tooltip Bootstrap
function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Inisialisasi DataTables
function initDataTables() {
  if (document.querySelector('.dataTable')) {
    $('.dataTable').DataTable({
      responsive: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
      },
      dom: '<"top"<"row"<"col-md-6"f><"col-md-6"l>>>rt<"bottom"<"row"<"col-md-6"i><"col-md-6"p>><"clear">',
      initComplete: function() {
        // Tambahkan class ke input pencarian
        $('.dataTables_filter input').addClass('form-control form-control-sm');
      }
    });
  }
}

// Inisialisasi tombol delete
function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.btn-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetUrl = this.getAttribute('href');
      const itemName = this.getAttribute('data-item') || 'data ini';
      
      // Tampilkan modal konfirmasi
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
      
      // Set up tombol hapus di modal
      document.querySelector('#deleteModal .btn-danger').onclick = function() {
        if (targetUrl) {
          window.location.href = targetUrl;
        } else {
          // Simulasi penghapusan
          const row = button.closest('tr');
          row.style.opacity = '0';
          setTimeout(() => row.remove(), 300);
          modal.hide();
          showToast('success', `Berhasil menghapus ${itemName}`);
        }
      };
    });
  });
}

// Inisialisasi validasi form
function initFormsValidation() {
  // Validasi otomatis untuk form dengan class 'needs-validation'
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
  
  // Validasi custom
  document.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('blur', validateInput);
  });
}

// Fungsi validasi input custom
function validateInput(e) {
  const input = e.target;
  const pattern = input.getAttribute('data-validate');
  const errorElement = input.nextElementSibling;
  
  if (pattern === 'email' && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input.value)) {
    input.classList.add('is-invalid');
    if (errorElement) errorElement.textContent = 'Format email tidak valid';
  } else if (pattern === 'numeric' && isNaN(input.value)) {
    input.classList.add('is-invalid');
    if (errorElement) errorElement.textContent = 'Harus berupa angka';
  } else if (input.required && !input.value.trim()) {
    input.classList.add('is-invalid');
    if (errorElement) errorElement.textContent = 'Field ini wajib diisi';
  } else {
    input.classList.remove('is-invalid');
    if (errorElement) errorElement.textContent = '';
  }
}

// Toggle password visibility
function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.password-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      }
    });
  });
}

// Fungsi untuk menampilkan toast notifikasi
function showToast(type, message) {
  const toastContainer = document.getElementById('toastContainer') || createToastContainer();
  const toastId = 'toast-' + Date.now();
  
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.id = toastId;
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Hapus toast setelah ditutup
  toast.addEventListener('hidden.bs.toast', function() {
    toast.remove();
  });
  
  return toastId;
}

// Membuat container toast jika belum ada
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'position-fixed bottom-0 end-0 p-3';
  container.style.zIndex = '11';
  document.body.appendChild(container);
  return container;
}

// Fungsi untuk generate QR Code
function generateQRCode(elementId, text, options = {}) {
  const defaultOptions = {
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  };
  
  const mergedOptions = {...defaultOptions, ...options};
  
  // Hapus QR code sebelumnya jika ada
  const element = document.getElementById(elementId);
  element.innerHTML = '';
  
  // Buat QR code baru
  new QRCode(element, {
    text: text,
    width: mergedOptions.width,
    height: mergedOptions.height,
    colorDark: mergedOptions.colorDark,
    colorLight: mergedOptions.colorLight,
    correctLevel: mergedOptions.correctLevel
  });
}

// Fungsi untuk memformat tanggal
function formatDate(dateString, format = 'dd/mm/yyyy') {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year);
}

// Fungsi untuk memformat angka ke Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}