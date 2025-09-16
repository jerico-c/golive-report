document.addEventListener('DOMContentLoaded', () => {
    // Mengambil elemen-elemen dari HTML
    const reportForm = document.getElementById('report-form');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const outputText = document.getElementById('output-text');
    const copyBtn = document.getElementById('copy-btn');
    const telegramBtn = document.getElementById('telegram-btn');
    const projectTypeRadios = document.querySelectorAll('input[name="project-type"]');

    // Input containers
    const singleOdpContainer = document.getElementById('odp-manual-container-single');
    const doubleOdpContainer = document.getElementById('odp-manual-container-double');
    
    // Default form fields (now hidden/shown based on project type)
    const defaultCoordsContainer = document.querySelector('label[for="coordinates"]').parentElement;
    const defaultValinsContainer = document.querySelector('label[for="valins-id"]').parentElement;

    // Daftar penanggung jawab (PIC)
    const picMapping = {
        'TMG': '@fakhrulfebr', 'PRN': '@fakhrulfebr', 'MGE': '@fakhrulfebr', 
        'MTY': '@fakhrulfebr', 'MUN': '@fakhrulfebr', 'SWT': '@fakhrulfebr',
        'KTA': '@uyeekhalo', 'PWJ': '@uyeekhalo', 'KBM': '@uyeekhalo',
        'KAK': '@uyeekhalo', 'KTW': '@uyeekhalo', 'GOM': '@uyeekhalo',
        'WOS': '@Meylinanan15'
    };

    // Fungsi untuk memformat koordinat
    const formatCoords = (e) => {
        let currentValue = e.target.value;
        if (currentValue.includes('\t')) {
            let parts = currentValue.split('\t');
            let lat = parts[0].replace(/,/g, '.');
            let lon = parts[1] ? parts[1].replace(/,/g, '.') : '';
            e.target.value = `${lat}, ${lon}`;
        }
    };
    
    // Terapkan auto-format ke semua input koordinat
    document.getElementById('coordinates').addEventListener('input', formatCoords);
    document.getElementById('odp-coords-1').addEventListener('input', formatCoords);
    document.getElementById('odp-coords-2').addEventListener('input', formatCoords);

    // Fungsi untuk mengatur tampilan form berdasarkan jenis proyek
    const toggleFormVisibility = (type) => {
        if (type === 'pt2as') {
            singleOdpContainer.classList.add('hidden');
            doubleOdpContainer.classList.add('hidden');
            defaultCoordsContainer.classList.remove('hidden');
            defaultValinsContainer.classList.remove('hidden');
        } else if (type === 'pt2-pt3-single') {
            singleOdpContainer.classList.remove('hidden');
            doubleOdpContainer.classList.add('hidden');
            defaultCoordsContainer.classList.remove('hidden');
            defaultValinsContainer.classList.remove('hidden');
        } else if (type === 'pt2-pt3-double') {
            singleOdpContainer.classList.add('hidden');
            doubleOdpContainer.classList.remove('hidden');
            defaultCoordsContainer.classList.add('hidden');
            defaultValinsContainer.classList.add('hidden');
        }
    };

    projectTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => toggleFormVisibility(e.target.value));
    });
    
    // Panggil sekali di awal untuk set state awal
    toggleFormVisibility('pt2as');

    // Tombol Generate Laporan
    generateBtn.addEventListener('click', () => {
        const projectType = document.querySelector('input[name="project-type"]:checked').value;
        const lopName = document.getElementById('lop-name').value.trim();
        const distribution = document.getElementById('distribution').value.trim();
        let reportText = '';

        let picOdpName; // Nama ODP yang digunakan untuk menentukan PIC & ODC

        if (projectType === 'pt2-pt3-double') {
            // --- LOGIKA UNTUK 2 ODP ---
            const odpName1 = document.getElementById('odp-name-1').value.trim();
            const odpCoords1 = document.getElementById('odp-coords-1').value.trim();
            const odpValins1 = document.getElementById('odp-valins-1').value.trim();
            const odpName2 = document.getElementById('odp-name-2').value.trim();
            const odpCoords2 = document.getElementById('odp-coords-2').value.trim();
            const odpValins2 = document.getElementById('odp-valins-2').value.trim();

            if (!odpName1 || !odpName2) { alert('Harap isi semua data untuk 2 ODP!'); return; }
            picOdpName = odpName1;

            const baseName = odpName1.substring(0, odpName1.lastIndexOf('/') + 1);
            const num1 = odpName1.substring(odpName1.lastIndexOf('/') + 1);
            const num2 = odpName2.substring(odpName2.lastIndexOf('/') + 1);
            const combinedOdpName = `${baseName}${num1}-${num2}`;

            const coordinatesBlock = `\`${odpName1}\`   ${odpCoords1}\n\`${odpName2}\`   ${odpCoords2}`;
            const valinsBlock = `\`${odpName1}\`   __${odpValins1}__\n\`${odpName2}\`   __${odpValins2}__`;

            const catuanOdc = `ODC-${picOdpName.split('/')[0].substring(4)}`;
            const regionCode = picOdpName.split('-')[1];
            const pic = picMapping[regionCode] || '@penanggung_jawab_tidak_ditemukan';

            reportText = 
`\`${combinedOdpName}\` (2 ODP) ${lopName} DISTRIBUSI ${distribution} CATUAN ${catuanOdc} SUDAH GOLIVE

\`Koordinat ODP :\`
${coordinatesBlock}

\`ID VALINS :\`
${valinsBlock}

${pic}`;

        } else {
            // --- LOGIKA UNTUK 1 ODP (OTOMATIS ATAU MANUAL) ---
            let odpName = '';
            if (projectType === 'pt2as') {
                const lopParts = lopName.split('-');
                if (lopParts.length >= 4) {
                    const match = lopParts[3].match(/^([A-Z]+)(\d+)$/);
                    if (match) odpName = `ODP-${lopParts[2]}-${match[1]}/${match[2]}`;
                }
            } else { // pt2-pt3-single
                odpName = document.getElementById('odp-name-manual').value.trim();
            }
            
            if (!odpName) { alert('Nama ODP tidak bisa ditentukan!'); return; }
            picOdpName = odpName;

            const coordinates = document.getElementById('coordinates').value.trim();
            const valinsId = document.getElementById('valins-id').value.trim();

            const catuanOdc = `ODC-${picOdpName.split('/')[0].substring(4)}`;
            const regionCode = picOdpName.split('-')[1];
            const pic = picMapping[regionCode] || '@penanggung_jawab_tidak_ditemukan';
            
            reportText = 
`\`${odpName}\` ${lopName} DISTRIBUSI ${distribution} CATUAN ${catuanOdc} SUDAH GOLIVE

\`Koordinat ODP :\`
${coordinates}

\`ID VALINS :\` 
__${valinsId}__

${pic}`;
        }
        
        outputText.value = reportText;
        resultContainer.classList.remove('hidden');
    });
    
    // Tombol Reset
    resetBtn.addEventListener('click', () => {
        reportForm.reset();
        resultContainer.classList.add('hidden');
        toggleFormVisibility('pt2as'); // Kembali ke state awal
        copyBtn.textContent = 'Salin Teks';
    });

    // Tombol Copy & Telegram
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
});
