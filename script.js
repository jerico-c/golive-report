document.addEventListener('DOMContentLoaded', () => {
    // Mengambil elemen-elemen dari HTML
    const reportForm = document.getElementById('report-form');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const outputText = document.getElementById('output-text');
    const copyBtn = document.getElementById('copy-btn');
    const telegramBtn = document.getElementById('telegram-btn');
    const coordinatesInput = document.getElementById('coordinates');

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
        const odpName = document.getElementById('odp-name').value.trim();
        const lopName = document.getElementById('lop-name').value.trim();
        const distribution = document.getElementById('distribution').value.trim();
        const coordinates = document.getElementById('coordinates').value.trim();
        const valinsId = document.getElementById('valins-id').value.trim();

        if (!odpName || !lopName || !distribution || !coordinates || !valinsId) {
            alert('Harap isi semua field terlebih dahulu!');
            return;
        }

        const odpParts = odpName.split('/');
        const odpMainPart = odpParts[0].substring(4);
        const catuanOdc = `ODC-${odpMainPart}`;

        const regionCode = odpMainPart.split('-')[0];
        const pic = picMapping[regionCode] || '@penanggung_jawab_tidak_ditemukan';

        // 4. Menyusun teks laporan sesuai format (dengan format Monospace & Italic)
        const reportText = 
`\`${odpName}\` ${lopName} DISTRIBUSI ${distribution} CATUAN ${catuanOdc} SUDAH GOLIVE

\`Koordinat ODP :\`
${coordinates}

\`ID VALINS :\`
_${valinsId}_

${pic}`;

        outputText.value = reportText;
        resultContainer.classList.remove('hidden');
    });

    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy');
        
        copyBtn.textContent = 'Berhasil Disalin!';
        setTimeout(() => {
            copyBtn.textContent = 'Salin Teks';
        }, 2000);
    });

    telegramBtn.addEventListener('click', () => {
        const text = outputText.value;
        if (text) {
            const encodedText = encodeURIComponent(text);
            const telegramUrl = `https://t.me/share/url?url=&text=${encodedText}`;
            window.open(telegramUrl, '_blank');
        }
    });

    resetBtn.addEventListener('click', () => {
        reportForm.reset();
        resultContainer.classList.add('hidden');
        copyBtn.textContent = 'Salin Teks';
    });

    coordinatesInput.addEventListener('input', (e) => {
        let currentValue = e.target.value;

        if (currentValue.includes('\t')) {
            let parts = currentValue.split('\t');
            let lat = parts[0].replace(/,/g, '.');
            let lon = parts[1] ? parts[1].replace(/,/g, '.') : '';
            currentValue = `${lat}, ${lon}`;
        }
        
        e.target.value = currentValue;
    });
});
