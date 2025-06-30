document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // mencegah reload form

    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // Simulasi autentikasi sederhana
    if (username === "admin") {
      window.location.href = "../index.html";
    } else if (username === "user") {
      window.location.href = "../user/beranda.html";
    } else {
      alert("Username tidak dikenali. Coba 'admin' atau 'user'.");
    }
  });
});
