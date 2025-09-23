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
    const generateFieldsBtn = document.getElementById('generate-fields-btn');

    // Input containers
    const singleOdpContainer = document.getElementById('odp-manual-container-single');
    const multiOdpOptions = document.getElementById('multi-odp-options');
    const multiOdpContainer = document.getElementById('odp-multi-container');
    const defaultCoordsContainer = document.getElementById('default-coordinates-container');
    const defaultValinsContainer = document.getElementById('default-valins-container');

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
    document.getElementById('coordinates').addEventListener('input', formatCoords);

    // Fungsi untuk mengatur tampilan form
    const toggleFormVisibility = (type) => {
        singleOdpContainer.classList.add('hidden');
        multiOdpOptions.classList.add('hidden');
        multiOdpContainer.classList.add('hidden');
        defaultCoordsContainer.classList.remove('hidden');
        defaultValinsContainer.classList.remove('hidden');

        if (type === 'pt2-pt3-single') {
            singleOdpContainer.classList.remove('hidden');
        } else if (type === 'pt2-pt3-multi') {
            multiOdpOptions.classList.remove('hidden');
            multiOdpContainer.classList.remove('hidden');
            defaultCoordsContainer.classList.add('hidden');
            defaultValinsContainer.classList.add('hidden');
        }
    };

    projectTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => toggleFormVisibility(e.target.value));
    });
    toggleFormVisibility('pt2as');

    // --- LOGIKA BARU: Membuat form input dinamis ---
    generateFieldsBtn.addEventListener('click', () => {
        const count = parseInt(document.getElementById('odp-count').value, 10);
        multiOdpContainer.innerHTML = ''; // Kosongkan container
        if (count > 0) {
            for (let i = 1; i <= count; i++) {
                const fieldsetHTML = `
                    <div class="odp-group">
                        <h4>Data ODP ${i}</h4>
                        <div class="form-group">
                            <label for="odp-name-${i}">Nama ODP ${i}</label>
                            <input type="text" id="odp-name-${i}" placeholder="ODP-XXX-YYY/ZZZ">
                        </div>
                        <div class="form-group">
                            <label for="odp-coords-${i}">Koordinat ODP ${i}</label>
                            <input type="text" id="odp-coords-${i}" placeholder="Latitude, Longitude">
                        </div>
                        <div class="form-group">
                            <label for="odp-valins-${i}">ID VALINS ${i}</label>
                            <input type="text" id="odp-valins-${i}" placeholder="12345678">
                        </div>
                    </div>`;
                multiOdpContainer.insertAdjacentHTML('beforeend', fieldsetHTML);
                // Tambahkan event listener untuk input koordinat yang baru dibuat
                document.getElementById(`odp-coords-${i}`).addEventListener('input', formatCoords);
            }
        }
    });

    // Tombol Generate Laporan
    generateBtn.addEventListener('click', () => {
        const projectType = document.querySelector('input[name="project-type"]:checked').value;
        const lopName = document.getElementById('lop-name').value.trim();
        const distribution = document.getElementById('distribution').value.trim();
        let reportText = '';
        let picOdpName;

        if (projectType === 'pt2-pt3-multi') {
            const odpGroups = multiOdpContainer.querySelectorAll('.odp-group');
            if (odpGroups.length === 0) {
                alert('Silakan buat form dan isi data ODP terlebih dahulu.');
                return;
            }
            
            const allOdpData = [];
            for (let i = 1; i <= odpGroups.length; i++) {
                const name = document.getElementById(`odp-name-${i}`).value.trim();
                const coords = document.getElementById(`odp-coords-${i}`).value.trim();
                const valins = document.getElementById(`odp-valins-${i}`).value.trim();
                if (!name || !coords || !valins) {
                    alert(`Data untuk ODP ${i} belum lengkap!`);
                    return;
                }
                allOdpData.push({ name, coords, valins });
            }

            picOdpName = allOdpData[0].name;
            const baseName = picOdpName.substring(0, picOdpName.lastIndexOf('/') + 1);
            const allNumbers = allOdpData.map(odp => odp.name.substring(odp.name.lastIndexOf('/') + 1));
            const combinedOdpName = `${baseName}${allNumbers.join('-')}`;
            
            const coordinatesBlock = allOdpData.map(odp => `\`${odp.name}\`   ${odp.coords}`).join('\n');
            const valinsBlock = allOdpData.map(odp => `\`${odp.name}\`   __${odp.valins}__`).join('\n');

            const catuanOdc = `ODC-${picOdpName.split('/')[0].substring(4)}`;
            const regionCode = picOdpName.split('-')[1];
            const pic = picMapping[regionCode] || '@penanggung_jawab_tidak_ditemukan';

            reportText = 
`\`${combinedOdpName}\` (${allOdpData.length} ODP) ${lopName} DISTRIBUSI ${distribution} CATUAN ${catuanOdc} SUDAH GOLIVE

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
        multiOdpContainer.innerHTML = '';
        toggleFormVisibility('pt2as');
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
