/**
 * CUSTOM JAVASCRIPT - FUNGSI KHUSUS APLIKASI
 * 
 * Berisi fungsi-fungsi khusus untuk aplikasi inventaris
 */

// Inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
  initItemForms();
  initLoanForms();
  initEmployeeForms();
  initCategoryForms();
  initImagePreview();
  initDatePickers();
});

// Fungsi khusus form barang
function initItemForms() {
  // Auto-generate kode barang
  const itemCodeInput = document.getElementById('itemCode');
  if (itemCodeInput && !itemCodeInput.value) {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    itemCodeInput.value = `INV-${currentYear}-${randomNum}`;
  }
  
  // Generate QR Code otomatis
  const qrCodeElement = document.getElementById('qrcode');
  if (qrCodeElement) {
    const itemCode = itemCodeInput ? itemCodeInput.value : 'INV-SAMPLE-001';
    generateQRCode('qrcode', itemCode, { width: 180, height: 180 });
    
    // Download QR Code
    const downloadBtn = document.getElementById('downloadQR');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function() {
        downloadQRCode(itemCode);
      });
    }
  }
}

// Fungsi khusus form peminjaman
function initLoanForms() {
  const loanForm = document.getElementById('loanForm');
  if (loanForm) {
    // Set tanggal pinjam default ke hari ini
    const today = new Date().toISOString().split('T')[0];
    const loanDateInput = document.getElementById('tanggalPinjam');
    if (loanDateInput) loanDateInput.value = today;
    
    // Set tanggal kembali default ke 7 hari setelahnya
    const returnDateInput = document.getElementById('tanggalKembali');
    if (returnDateInput) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      returnDateInput.value = nextWeek.toISOString().split('T')[0];
    }
    
    // Validasi tanggal kembali harus setelah tanggal pinjam
    if (loanDateInput && returnDateInput) {
      loanDateInput.addEventListener('change', function() {
        if (returnDateInput.value && returnDateInput.value < this.value) {
          returnDateInput.value = this.value;
        }
      });
      
      returnDateInput.addEventListener('change', function() {
        if (this.value < loanDateInput.value) {
          showToast('danger', 'Tanggal kembali harus setelah tanggal pinjam');
          this.value = loanDateInput.value;
        }
      });
    }
  }
  
  // Mark as returned button
  const markReturnedBtn = document.querySelector('.mark-returned');
  if (markReturnedBtn) {
    markReturnedBtn.addEventListener('click', function() {
      if (confirm('Apakah Anda yakin ingin menandai peminjaman ini sebagai dikembalikan?')) {
        showToast('success', 'Peminjaman berhasil ditandai sebagai dikembalikan');
        // Simulasi update status
        const statusBadge = document.querySelector('.loan-status');
        if (statusBadge) {
          statusBadge.className = 'badge bg-success';
          statusBadge.textContent = 'Dikembalikan';
        }
        this.disabled = true;
      }
    });
  }
}

// Fungsi khusus form pegawai
function initEmployeeForms() {
  // Validasi email khusus
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.value)) {
        this.classList.add('is-invalid');
        const errorElement = this.nextElementSibling;
        if (errorElement) errorElement.textContent = 'Format email tidak valid';
      }
    });
  });
}

// Fungsi khusus form kategori
function initCategoryForms() {
  // Tidak ada fungsi khusus saat ini
}

// Preview gambar sebelum upload
function initImagePreview() {
  const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
  imageInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const previewContainer = document.getElementById('imagePreview') || 
          createImagePreviewContainer(input);
        
        const reader = new FileReader();
        reader.onload = function(event) {
          previewContainer.innerHTML = `
            <img src="${event.target.result}" class="img-thumbnail mb-2">
            <button type="button" class="btn btn-sm btn-danger remove-image">
              <i class="bi bi-trash"></i> Hapus Gambar
            </button>
          `;
          
          // Tambahkan event listener untuk tombol hapus
          previewContainer.querySelector('.remove-image').addEventListener('click', function() {
            input.value = '';
            previewContainer.innerHTML = '';
          });
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

// Membuat container preview gambar jika belum ada
function createImagePreviewContainer(input) {
  const container = document.createElement('div');
  container.id = 'imagePreview';
  container.className = 'mt-2';
  input.parentNode.insertBefore(container, input.nextSibling);
  return container;
}

// Inisialisasi date picker
function initDatePickers() {
  // Jika menggunakan flatpickr atau library lain bisa diinisialisasi di sini
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    // Set minimum date to today for future dates
    if (input.id.includes('Pinjam') || input.id.includes('Kembali') || input.id.includes('Beli')) {
      input.min = new Date().toISOString().split('T')[0];
    }
  });
}

// Fungsi untuk download QR Code
function downloadQRCode(text) {
  const canvas = document.querySelector('#qrcode canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = `QRCode-${text}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('success', 'QR Code berhasil diunduh');
  } else {
    showToast('danger', 'Gagal mengunduh QR Code');
  }
}

// Fungsi untuk menghitung selisih hari
function dateDiffInDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Fungsi untuk mengecek status peminjaman
function checkLoanStatus(returnDate) {
  const today = new Date();
  const returnDay = new Date(returnDate);
  
  if (today > returnDay) {
    return {
      status: 'Terlambat',
      class: 'danger',
      days: dateDiffInDays(returnDay, today)
    };
  } else if (today.toDateString() === returnDay.toDateString()) {
    return {
      status: 'Jatuh Tempo',
      class: 'warning'
    };
  } else {
    return {
      status: 'Aktif',
      class: 'success',
      days: dateDiffInDays(today, returnDay)
    };
  }
}