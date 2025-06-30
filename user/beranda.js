document.addEventListener("DOMContentLoaded", function () {
    const kapasitasMaks = 30;
    const dataPerPage = 5;
    let currentPage = 1;

    const sesiData = [
        {
            jam: "08:00 - 12:00",
            data: [10, 22, 20, 19, 21],
            gender: ["wanita", "pria", "wanita", "pria", "pria"],
            detail: [
                Array.from({ length: 10 }, (_, i) => ({ nama: `Yudi ${i + 1}`, nip: `2001${i + 1}`, hp: `0812${i + 1}0000` })),
                Array.from({ length: 22 }, (_, i) => ({ nama: `Candra ${i + 1}`, nip: `2002${i + 1}`, hp: `0813${i + 1}0000` })),
                Array.from({ length: 20 }, (_, i) => ({ nama: `Raihan ${i + 1}`, nip: `1999${i + 1}`, hp: `0814${i + 1}0000` })),
                Array.from({ length: 19 }, (_, i) => ({ nama: `Maulana ${i + 1}`, nip: `1996${i + 1}`, hp: `0815${i + 1}0000` })),
                Array.from({ length: 21 }, (_, i) => ({ nama: `Koto ${i + 1}`, nip: `2002${i + 1}`, hp: `0816${i + 1}0000` }))
            ]
        },
        {
            jam: "12:00 - 18:00",
            data: [20, 17, 23, 18, 16],
            gender: ["pria", "wanita", "pria", "wanita", "wanita"],
            detail: [
                Array.from({ length: 20 }, (_, i) => ({ nama: `Yudi ${i + 1}`, nip: `2001${i + 1}`, hp: `0812${i + 1}0000` })),
                Array.from({ length: 17 }, (_, i) => ({ nama: `Candra ${i + 1}`, nip: `2002${i + 1}`, hp: `0813${i + 1}0000` })),
                Array.from({ length: 23 }, (_, i) => ({ nama: `Raihan ${i + 1}`, nip: `1999${i + 1}`, hp: `0814${i + 1}0000` })),
                Array.from({ length: 18 }, (_, i) => ({ nama: `Maulana ${i + 1}`, nip: `1996${i + 1}`, hp: `0815${i + 1}0000` })),
                Array.from({ length: 16 }, (_, i) => ({ nama: `Koto ${i + 1}`, nip: `2002${i + 1}`, hp: `0816${i + 1}0000` }))
            ]
        },
        {
            jam: "18:00 - 20:00",
            data: [15, 19, 18, 20, 22],
            gender: ["pria", "pria", "pria", "pria", "pria"],
            detail: [
                Array.from({ length: 15 }, (_, i) => ({ nama: `Yudi ${i + 1}`, nip: `2001${i + 1}`, hp: `0812${i + 1}0000` })),
                Array.from({ length: 19 }, (_, i) => ({ nama: `Candra ${i + 1}`, nip: `2002${i + 1}`, hp: `0813${i + 1}0000` })),
                Array.from({ length: 18 }, (_, i) => ({ nama: `Raihan ${i + 1}`, nip: `1999${i + 1}`, hp: `0814${i + 1}0000` })),
                Array.from({ length: 20 }, (_, i) => ({ nama: `Maulana ${i + 1}`, nip: `1996${i + 1}`, hp: `0815${i + 1}0000` })),
                Array.from({ length: 22 }, (_, i) => ({ nama: `Koto ${i + 1}`, nip: `2002${i + 1}`, hp: `0816${i + 1}0000` }))
            ]
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
        return tgl.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
    }

    function tampilkanData(weekDates) {
        const tbody = document.querySelector("#tabel-pengunjung tbody");
        const thead = document.querySelector("#tabel-pengunjung thead tr");

        thead.innerHTML = `<th>SESI</th>`;
        weekDates.forEach((tgl) => {
            const th = document.createElement("th");
            th.innerHTML = tgl.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
            thead.appendChild(th);
        });

        document.getElementById("mingguLabel").textContent =
            `Jadwal: ${formatTanggal(weekDates[0])} - ${formatTanggal(weekDates[4])}`;

        tbody.innerHTML = "";

        sesiData.forEach((row, sesiIndex) => {
            const tr = document.createElement("tr");
            const tdJam = document.createElement("td");
            tdJam.textContent = row.jam;
            tr.appendChild(tdJam);

            row.data.forEach((jumlah, hariIndex) => {
                const td = document.createElement("td");
                const persen = Math.min(100, Math.round((jumlah / kapasitasMaks) * 100));
                const warnaBar = persen >= 80 ? "bg-danger" : persen >= 50 ? "bg-warning" : "bg-success";
                const badgeClass = row.gender[hariIndex] === "pria" ? "bg-info text-dark" : "bg-pink";

                td.innerHTML = `
                    <div class="d-flex flex-column align-items-center">
                      <span class="badge jumlah ${badgeClass} mb-1"
                            data-sesi="${sesiIndex}" data-hari="${hariIndex}" style="cursor:pointer">
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

        document.getElementById("tabel-detail").innerHTML = "";
    }

    $(document).on("click", ".badge.jumlah", function () {
        const sesiIndex = $(this).data("sesi");
        const hariIndex = $(this).data("hari");
        const detail = sesiData[sesiIndex].detail?.[hariIndex] || [];
        currentPage = 1;
        renderDetailTable(detail);
        renderPagination(detail);
    });

   
});
