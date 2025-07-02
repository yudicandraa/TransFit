let html5QrCode;

function bukaModalQR() {
  const qrModalEl = document.getElementById("modalkamera");
  const modal = new bootstrap.Modal(qrModalEl);
  modal.show();

  qrModalEl.addEventListener("shown.bs.modal", () => {
    const qrRegion = document.getElementById("reader");
    const hasilScan = document.getElementById("hasilScan");

    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode("reader");
    }

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250
          },
          (decodedText) => {
            hasilScan.innerText = `✅ QR Terdeteksi: ${decodedText}`;
            html5QrCode.stop().then(() => html5QrCode.clear());
          },
          (errorMessage) => {
            // Ignore scan errors
          }
        );
      } else {
        hasilScan.innerText = "❌ Tidak ada kamera ditemukan.";
      }
    }).catch((err) => {
      hasilScan.innerText = `❌ Error akses kamera: ${err}`;
    });
  });

  qrModalEl.addEventListener("hidden.bs.modal", () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => html5QrCode.clear()).catch((err) => {
        console.error("Gagal menghentikan kamera:", err);
      });
    }
    document.getElementById("hasilScan").innerText = "";
  });
}
