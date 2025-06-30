document.addEventListener("DOMContentLoaded", function () {
  const kapasitasMaks = 30;

  const sesiData = [
    {
      jam: "08:00 - 12:00",
      data: [10, 22, 20, 19, 21],
      gender: ["wanita", "pria", "wanita", "pria", "pria"]
    },
    {
      jam: "12:00 - 18:00",
      data: [20, 17, 23, 18, 16],
      gender: ["pria", "wanita", "pria", "wanita", "wanita"]
    },
    {
      jam: "18:00 - 20:00",
      data: [15, 19, 18, 20, 22],
      gender: ["pria", "pria", "pria", "pria", "pria"]
    }
  ];

  function getMingguKerja(dariTanggal = new Date()) {
    const hari = dariTanggal.getDay();
    const senin = new Date(dariTanggal);
    senin.setDate(dariTanggal.getDate() - ((hari + 6) % 7));
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(senin);
      d.setDate(senin.getDate() + i);
      return d;
    });
  }

  function formatTanggal(tgl) {
    return tgl.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function tampilkanData(weekDates) {
    const tbody = document.querySelector("#tabel-pengunjung tbody");
    const thead = document.querySelector("#tabel-pengunjung thead tr");

    thead.innerHTML = `<th>SESI</th>`;
    weekDates.forEach((tgl) => {
      const th = document.createElement("th");
      th.innerHTML = tgl.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });
      thead.appendChild(th);
    });

    const mingguLabel = document.getElementById("mingguLabel");
    if (mingguLabel) {
      mingguLabel.textContent = `Jadwal: ${formatTanggal(
        weekDates[0]
      )} - ${formatTanggal(weekDates[4])}`;
    }

    tbody.innerHTML = "";

    sesiData.forEach((row) => {
      const tr = document.createElement("tr");
      const tdJam = document.createElement("td");
      tdJam.textContent = row.jam;
      tr.appendChild(tdJam);

      row.data.forEach((jumlah, hariIndex) => {
        const td = document.createElement("td");
        const persen = Math.min(100, Math.round((jumlah / kapasitasMaks) * 100));
        const warnaBar =
          persen >= 80
            ? "bg-danger"
            : persen >= 50
            ? "bg-warning"
            : "bg-success";
        const badgeClass =
          row.gender[hariIndex] === "pria" ? "bg-info text-dark" : "bg-pink";

        td.innerHTML = `
          <div class="d-flex flex-column align-items-center">
            <span class="badge jumlah ${badgeClass} mb-1">
              ${jumlah} / ${kapasitasMaks} Orang
            </span>
            <div class="progress w-100">
              <div class="progress-bar ${warnaBar}" style="width: ${persen}%;"></div>
            </div>
          </div>
        `;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  tampilkanData(getMingguKerja(new Date()));

  // ✅ Handler tombol booking
  const btnAturJadwal = document.getElementById("btnAturJadwal");

  btnAturJadwal.addEventListener("click", function () {
    const modalBookingEl = document.getElementById('modalBooking');
    const modalBooking = bootstrap.Modal.getInstance(modalBookingEl);
    modalBooking.hide();

    setTimeout(() => {
      const modalKonfirmasi = new bootstrap.Modal(document.getElementById('modalKonfirmasi'));
      modalKonfirmasi.show();
    }, 500);
  });
   const sidebar = document.getElementById('sidebarToggle');
        const toggleBtn = document.getElementById('collapseBtn');
        const logo = document.getElementById('sidebarLogo');

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            logo.src = sidebar.classList.contains('collapsed') ? '../assets/logo/logo_dishub.png' : '../assets/logo/logo_transfit.png';
            logo.width = sidebar.classList.contains('collapsed') ? 50 : 150;
            updateMainContentMargin();
        });

        // Set margin awal saat load
        updateMainContentMargin();
  // ✅ Modal Feedback - Validasi & Submit Opsional
  const formFeedback = document.getElementById("formFeedback");
  const modalFeedbackEl = document.getElementById("modalFeedback");

  if (formFeedback) {
    formFeedback.addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = document.getElementById("nama").value.trim();
      const email = document.getElementById("email").value.trim();
      const masukan = document.getElementById("masukan").value.trim();

      if (!nama || !email || !masukan) {
        alert("Mohon lengkapi semua bidang masukan.");
        return;
      }

      // Simulasi simpan data (di sini bisa pakai fetch/AJAX ke backend jika ada)
      console.log("Feedback dikirim:", {
        nama,
        email,
        masukan,
        rating: currentRating
      });

      const feedbackModal = bootstrap.Modal.getInstance(modalFeedbackEl);
      feedbackModal.hide();

      setTimeout(() => {
        alert("Terima kasih atas masukan Anda!");
        formFeedback.reset();
        currentRating = 4;
        updateStars(); // Reset rating bintang
      }, 300);
    });
  }

  // ✅ Interaksi Rating Bintang
  const stars = document.querySelectorAll('#ratingStars i');
  let currentRating = 4;

  function updateStars() {
    stars.forEach((star, index) => {
      star.classList.toggle('bi-star-fill', index < currentRating);
      star.classList.toggle('bi-star', index >= currentRating);
    });
  }

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      currentRating = index + 1;
      updateStars();
    });
  });

  updateStars();

});
