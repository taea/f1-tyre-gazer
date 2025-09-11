// Current F1 Drivers at Dutch GP 2025 (ordered by 2024 Constructor's Championship)
const drivers = [
    // McLaren (1st in 2024)
    { number: 4, code: 'NOR', name: 'Lando Norris', team: 'mclaren', tyres: ['M'], retired: false },
    { number: 81, code: 'PIA', name: 'Oscar Piastri', team: 'mclaren', tyres: ['M'], retired: false },
    // Ferrari (2nd in 2024)
    { number: 16, code: 'LEC', name: 'Charles Leclerc', team: 'ferrari', tyres: ['M'], retired: false },
    { number: 44, code: 'HAM', name: 'Lewis Hamilton', team: 'ferrari', tyres: ['M'], retired: false },
    // Red Bull (3rd in 2024)
    { number: 1, code: 'VER', name: 'Max Verstappen', team: 'redbull', tyres: ['M'], retired: false },
    { number: 22, code: 'TSU', name: 'Yuki Tsunoda', team: 'redbull', tyres: ['M'], retired: false },
    // Mercedes (4th in 2024)
    { number: 63, code: 'RUS', name: 'George Russell', team: 'mercedes', tyres: ['M'], retired: false },
    { number: 12, code: 'ANT', name: 'Andrea Kimi Antonelli', team: 'mercedes', tyres: ['M'], retired: false },
    // Aston Martin (5th in 2024)
    { number: 14, code: 'ALO', name: 'Fernando Alonso', team: 'astonmartin', tyres: ['M'], retired: false },
    { number: 18, code: 'STR', name: 'Lance Stroll', team: 'astonmartin', tyres: ['M'], retired: false },
    // Alpine (6th in 2024)
    { number: 10, code: 'GAS', name: 'Pierre Gasly', team: 'alpine', tyres: ['M'], retired: false },
    { number: 21, code: 'COL', name: 'Franco Colapinto', team: 'alpine', tyres: ['M'], retired: false },
    // Williams (7th in 2024)
    { number: 23, code: 'ALB', name: 'Alex Albon', team: 'williams', tyres: ['M'], retired: false },
    { number: 55, code: 'SAI', name: 'Carlos Sainz', team: 'williams', tyres: ['M'], retired: false },
    // VCARB (8th in 2024)
    { number: 33, code: 'HAD', name: 'Isack Hadjar', team: 'vcarb', tyres: ['M'], retired: false },
    { number: 30, code: 'LAW', name: 'Liam Lawson', team: 'vcarb', tyres: ['M'], retired: false },
    // Kick Sauber (9th in 2024)
    { number: 27, code: 'HUL', name: 'Nico Hulkenberg', team: 'kicksauber', tyres: ['M'], retired: false },
    { number: 87, code: 'BOR', name: 'Gabriel Bortoleto', team: 'kicksauber', tyres: ['M'], retired: false },
    // Haas (10th in 2024)
    { number: 31, code: 'OCO', name: 'Esteban Ocon', team: 'haas', tyres: ['M'], retired: false },
    { number: 43, code: 'BEA', name: 'Oliver Bearman', team: 'haas', tyres: ['M'], retired: false }
];

let currentDriverIndex = null;

// Load data from Local Storage on startup
function loadFromStorage() {
    const savedData = localStorage.getItem('f1TyreData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        parsedData.forEach((savedDriver, index) => {
            if (drivers[index] && drivers[index].number === savedDriver.number) {
                drivers[index].tyres = savedDriver.tyres || ['M'];
                drivers[index].retired = savedDriver.retired || false;
            }
        });
    }
}

// Save data to Local Storage
function saveToStorage() {
    const dataToSave = drivers.map(driver => ({
        number: driver.number,
        tyres: driver.tyres,
        retired: driver.retired
    }));
    localStorage.setItem('f1TyreData', JSON.stringify(dataToSave));
}

// Render the drivers list
function renderDrivers() {
    const driversList = document.getElementById('driversList');
    driversList.innerHTML = '';

    drivers.forEach((driver, index) => {
        const driverRow = document.createElement('div');
        driverRow.className = 'driver-row';
        driverRow.onclick = () => openModal(index);

        // Create inner container for content that needs opacity
        const driverContent = document.createElement('div');
        driverContent.className = driver.retired ? 'driver-content retired' : 'driver-content';

        const driverNumber = document.createElement('div');
        driverNumber.className = `driver-number team-${driver.team}`;
        driverNumber.textContent = driver.number;

        const driverCode = document.createElement('div');
        driverCode.className = 'driver-code';
        driverCode.textContent = driver.code;

        const tyresContainer = document.createElement('div');
        tyresContainer.className = 'tyres-container';

        // Show tyres for all drivers
        driver.tyres.forEach((tyre, tyreIndex) => {
            const tyreBadge = document.createElement('div');
            tyreBadge.className = driver.retired ? `tyre-badge tyre-${tyre} retired-tyre` : `tyre-badge tyre-${tyre}`;
            tyreBadge.textContent = tyre;
            tyreBadge.onclick = (e) => {
                e.stopPropagation();
                if (!driver.retired) {
                    removeTyre(index, tyreIndex);
                }
            };
            tyresContainer.appendChild(tyreBadge);
        });
        
        // Add OUT label if driver is retired
        if (driver.retired) {
            const outLabel = document.createElement('div');
            outLabel.className = 'out-label';
            outLabel.textContent = 'OUT';
            tyresContainer.appendChild(outLabel);
        }

        driverContent.appendChild(driverNumber);
        driverContent.appendChild(driverCode);
        driverContent.appendChild(tyresContainer);
        driverRow.appendChild(driverContent);
        driversList.appendChild(driverRow);
    });
}

// Open modal for pit stop
function openModal(driverIndex) {
    currentDriverIndex = driverIndex;
    const driver = drivers[driverIndex];
    
    const modalDriverNumber = document.getElementById('modalDriverNumber');
    modalDriverNumber.textContent = driver.number;
    modalDriverNumber.className = `driver-number team-${driver.team}`;
    
    document.getElementById('modalDriverCode').textContent = driver.code;
    document.getElementById('tyreSelect').value = '';
    
    // Apply team color to modal content
    const modalContent = document.querySelector('.modal-content');
    modalContent.className = `modal-content team-${driver.team}`;
    
    // Disable tyre selection and PITOUT button if driver is retired
    const tyreSelect = document.getElementById('tyreSelect');
    const pitOutBtn = document.getElementById('pitOutBtn');
    const retireBtn = document.getElementById('retireBtn');
    
    if (driver.retired) {
        tyreSelect.disabled = true;
        pitOutBtn.disabled = true;
        retireBtn.textContent = 'REJOIN';
    } else {
        tyreSelect.disabled = false;
        pitOutBtn.disabled = false;
        retireBtn.textContent = 'RETIRE';
    }
    
    const modal = document.getElementById('pitModal');
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('pitModal');
    modal.classList.remove('active');
    
    // Remove team class from modal content
    const modalContent = document.querySelector('.modal-content');
    modalContent.className = 'modal-content';
    
    currentDriverIndex = null;
}

// Add tyre to driver
function addTyre() {
    const tyreSelect = document.getElementById('tyreSelect');
    const selectedTyre = tyreSelect.value;
    
    if (selectedTyre && currentDriverIndex !== null) {
        drivers[currentDriverIndex].tyres.push(selectedTyre);
        saveToStorage();
        renderDrivers();
        closeModal();
    }
}

// Remove tyre from driver
function removeTyre(driverIndex, tyreIndex) {
    if (confirm('このタイヤ履歴を削除しますか？')) {
        drivers[driverIndex].tyres.splice(tyreIndex, 1);
        saveToStorage();
        renderDrivers();
    }
}

// Toggle driver retirement status
function toggleRetirement() {
    if (currentDriverIndex !== null) {
        const driver = drivers[currentDriverIndex];
        
        if (driver.retired) {
            // Rejoin the race
            driver.retired = false;
        } else {
            // Retire from the race
            if (confirm(`${driver.name}をリタイアさせますか？`)) {
                driver.retired = true;
            }
        }
        
        saveToStorage();
        renderDrivers();
        closeModal();
    }
}

// Reset all tyres
function resetAllTyres() {
    if (confirm('すべてのタイヤ履歴をリセットしますか？\nこの操作は取り消せません。')) {
        drivers.forEach(driver => {
            driver.tyres = ['M'];
        });
        saveToStorage();
        renderDrivers();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderDrivers();
    
    document.getElementById('pitOutBtn').addEventListener('click', addTyre);
    document.getElementById('retireBtn').addEventListener('click', toggleRetirement);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('resetAllBtn').addEventListener('click', resetAllTyres);
    
    // Close modal when clicking outside
    document.getElementById('pitModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('pitModal')) {
            closeModal();
        }
    });
});