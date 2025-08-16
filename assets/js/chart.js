/**
 * CHART.JS - INISIALISASI GRAFIK
 * 
 * Berisi semua fungsi untuk inisialisasi dan update chart
 */

// Chart warna default
const chartColors = {
  primary: '#4e73df',
  success: '#1cc88a',
  info: '#36b9cc',
  warning: '#f6c23e',
  danger: '#e74a3b',
  secondary: '#858796',
  dark: '#5a5c69'
};

// Inisialisasi semua chart saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
  initAreaChart();
  initPieChart();
  initBarChart();
});

// Area Chart
function initAreaChart() {
  const ctx = document.getElementById('myAreaChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Peminjaman",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: chartColors.primary,
        pointRadius: 3,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: chartColors.primary,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.primary,
        pointHoverBorderColor: "rgba(255,255,255,0.8)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [0, 10, 5, 15, 10, 20, 15, 25, 20, 30, 25, 40],
      }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgb(255,255,255)",
          bodyColor: "#858796",
          titleMarginBottom: 10,
          titleColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function(context) {
              return 'Peminjaman: ' + context.parsed.y;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        },
        y: {
          ticks: {
            maxTicksLimit: 5,
            padding: 10
          },
          grid: {
            color: "rgb(234, 236, 244)",
            drawBorder: false
          }
        }
      }
    }
  });
}

// Pie Chart
function initPieChart() {
  const ctx = document.getElementById('myPieChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Elektronik", "Furniture", "Alat Kantor", "Kendaraan", "Lainnya"],
      datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          chartColors.primary,
          chartColors.success,
          chartColors.info,
          chartColors.warning,
          chartColors.secondary
        ],
        hoverBackgroundColor: [
          '#2e59d9',
          '#17a673',
          '#2c9faf',
          '#dda20a',
          '#6c757d'
        ],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgb(255,255,255)",
          bodyColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '75%',
    },
  });
}

// Bar Chart (untuk halaman laporan)
function initBarChart() {
  const ctx = document.getElementById('myBarChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Barang Baik", "Barang Rusak Ringan", "Barang Rusak Berat", "Barang Hilang"],
      datasets: [{
        label: "Jumlah",
        backgroundColor: [
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
          chartColors.secondary
        ],
        hoverBackgroundColor: [
          '#17a673',
          '#dda20a',
          '#be2617',
          '#6c757d'
        ],
        borderColor: "#fff",
        borderWidth: 1,
        data: [120, 15, 7, 3],
      }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: "rgb(255,255,255)",
          bodyColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: true,
          caretPadding: 10,
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          grid: {
            color: "rgb(234, 236, 244)",
            drawBorder: false
          },
          ticks: {
            beginAtZero: true
          }
        }
      }
    }
  });
}

// Fungsi untuk update chart dengan data baru
function updateChart(chartId, newData) {
  const chart = Chart.getChart(chartId);
  if (chart) {
    chart.data.datasets.forEach((dataset, i) => {
      dataset.data = newData[i].data || dataset.data;
      if (newData[i].label) dataset.label = newData[i].label;
    });
    chart.update();
  }
}