document.addEventListener('DOMContentLoaded', () => {
    // Mengambil elemen-elemen dari HTML
    const reportForm = document.getElementById('report-form');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const outputText = document.getElementById('output-text');
    const copyBtn = document.getElementById('copy-btn');
    const telegramBtn = document.getElementById('telegram-btn');

    // Daftar penanggung jawab (PIC) berdasarkan kode wilayah
    const picMapping = {
        // PIC: @fakhrulfebr
        'TMG': '@fakhrulfebr', 'PRN': '@fakhrulfebr', 'MGE': '@fakhrulfebr', 
        'MTY': '@fakhrulfebr', 'MUN': '@fakhrulfebr', 'SWT': '@fakhrulfebr',
        // PIC: @uyeekhalo
        'KTA': '@uyeekhalo', 'PWJ': '@uyeekhalo', 'KBM': '@uyeekhalo',
        'KAK': '@uyeekhalo', 'KTW': '@uyeekhalo', 'GOM': '@uyeekhalo',
        // PIC: @Meylinanan15
        'WOS': '@Meylinanan15'
    };

    // Fungsi yang dijalankan ketika tombol "Buat Laporan" diklik
    generateBtn.addEventListener('click', () => {
        // 1. Mengambil semua nilai dari form input
        const odpName = document.getElementById('odp-name').value.trim();
        const lopName = document.getElementById('lop-name').value.trim();
        const distribution = document.getElementById('distribution').value.trim();
        const coordinates = document.getElementById('coordinates').value.trim();
        const valinsId = document.getElementById('valins-id').value.trim();

        // Validasi sederhana, pastikan semua field diisi
        if (!odpName || !lopName || !distribution || !coordinates || !valinsId) {
            alert('Harap isi semua field terlebih dahulu!');
            return;
        }

        // 2. Logika untuk menentukan ODC secara otomatis
        const odpParts = odpName.split('/');
        const odpMainPart = odpParts[0].substring(4);
        const catuanOdc = `ODC-${odpMainPart}`;

        // 3. Logika untuk menentukan penanggung jawab (PIC)
        const regionCode = odpMainPart.split('-')[0];
        const pic = picMapping[regionCode] || '@penanggung_jawab_tidak_ditemukan';

        // 4. Menyusun teks laporan sesuai format
        const reportText = 
`${odpName} ${lopName} DISTRIBUSI ${distribution} CATUAN ${catuanOdc} SUDAH GOLIVE

Koordinat ODP :
${coordinates}

ID VALINS :
${valinsId}

${pic}`;

        // 5. Menampilkan hasil
        outputText.value = reportText;
        resultContainer.classList.remove('hidden');
    });

    // Fungsi untuk tombol "Salin Teks"
    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy');
        
        copyBtn.textContent = 'Berhasil Disalin!';
        setTimeout(() => {
            copyBtn.textContent = 'Salin Teks';
        }, 2000);
    });

    // Fungsi untuk tombol "Kirim ke Telegram"
    telegramBtn.addEventListener('click', () => {
        const text = outputText.value;
        if (text) {
            const encodedText = encodeURIComponent(text);
            const telegramUrl = `https://t.me/share/url?url=&text=${encodedText}`;
            window.open(telegramUrl, '_blank');
        }
    });

    // Fungsi untuk tombol "Reset Form"
    resetBtn.addEventListener('click', () => {
        reportForm.reset();
        resultContainer.classList.add('hidden');
        copyBtn.textContent = 'Salin Teks';
    });
});
