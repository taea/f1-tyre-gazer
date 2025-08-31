// Current F1 Drivers at Dutch GP 2025 (ordered by 2024 Constructor's Championship)
const drivers = [
    // McLaren (1st in 2024)
    { number: 4, code: 'NOR', name: 'Lando Norris', team: 'mclaren', tyres: [] },
    { number: 81, code: 'PIA', name: 'Oscar Piastri', team: 'mclaren', tyres: [] },
    // Ferrari (2nd in 2024)
    { number: 16, code: 'LEC', name: 'Charles Leclerc', team: 'ferrari', tyres: [] },
    { number: 44, code: 'HAM', name: 'Lewis Hamilton', team: 'ferrari', tyres: [] },
    // Red Bull (3rd in 2024)
    { number: 1, code: 'VER', name: 'Max Verstappen', team: 'redbull', tyres: [] },
    { number: 22, code: 'TSU', name: 'Yuki Tsunoda', team: 'redbull', tyres: [] },
    // Mercedes (4th in 2024)
    { number: 12, code: 'ANT', name: 'Andrea Kimi Antonelli', team: 'mercedes', tyres: [] },
    { number: 63, code: 'RUS', name: 'George Russell', team: 'mercedes', tyres: [] },
    // Aston Martin (5th in 2024)
    { number: 14, code: 'ALO', name: 'Fernando Alonso', team: 'astonmartin', tyres: [] },
    { number: 18, code: 'STR', name: 'Lance Stroll', team: 'astonmartin', tyres: [] },
    // Alpine (6th in 2024)
    { number: 10, code: 'GAS', name: 'Pierre Gasly', team: 'alpine', tyres: [] },
    { number: 21, code: 'COR', name: 'Franco Colapinto', team: 'alpine', tyres: [] },
    // Williams (7th in 2024)
    { number: 23, code: 'ALB', name: 'Alex Albon', team: 'williams', tyres: [] },
    { number: 55, code: 'SAI', name: 'Carlos Sainz', team: 'williams', tyres: [] },
    // VCARB (8th in 2024)
    { number: 33, code: 'HAD', name: 'Isack Hadjar', team: 'vcarb', tyres: [] },
    { number: 30, code: 'LAW', name: 'Liam Lawson', team: 'vcarb', tyres: [] },
    // Kick Sauber (9th in 2024)
    { number: 27, code: 'HUL', name: 'Nico Hulkenberg', team: 'kicksauber', tyres: [] },
    { number: 87, code: 'BOR', name: 'Gabriel Bortoleto', team: 'kicksauber', tyres: [] },
    // Haas (10th in 2024)
    { number: 31, code: 'OCO', name: 'Esteban Ocon', team: 'haas', tyres: [] },
    { number: 43, code: 'BEA', name: 'Oliver Bearman', team: 'haas', tyres: [] }
];

let currentDriverIndex = null;

// Load data from Local Storage on startup
function loadFromStorage() {
    const savedData = localStorage.getItem('f1TyreData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        parsedData.forEach((savedDriver, index) => {
            if (drivers[index] && drivers[index].number === savedDriver.number) {
                drivers[index].tyres = savedDriver.tyres || [];
            }
        });
    }
}

// Save data to Local Storage
function saveToStorage() {
    const dataToSave = drivers.map(driver => ({
        number: driver.number,
        tyres: driver.tyres
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

        const driverNumber = document.createElement('div');
        driverNumber.className = `driver-number team-${driver.team}`;
        driverNumber.textContent = driver.number;

        const driverCode = document.createElement('div');
        driverCode.className = 'driver-code';
        driverCode.textContent = driver.code;

        const tyresContainer = document.createElement('div');
        tyresContainer.className = 'tyres-container';

        driver.tyres.forEach((tyre, tyreIndex) => {
            const tyreBadge = document.createElement('div');
            tyreBadge.className = `tyre-badge tyre-${tyre}`;
            tyreBadge.textContent = tyre;
            tyreBadge.onclick = (e) => {
                e.stopPropagation();
                removeTyre(index, tyreIndex);
            };
            tyresContainer.appendChild(tyreBadge);
        });

        driverRow.appendChild(driverNumber);
        driverRow.appendChild(driverCode);
        driverRow.appendChild(tyresContainer);
        driversList.appendChild(driverRow);
    });
}

// Open modal for pit stop
function openModal(driverIndex) {
    currentDriverIndex = driverIndex;
    const driver = drivers[driverIndex];
    
    document.getElementById('modalDriverNumber').textContent = driver.number;
    document.getElementById('modalDriverCode').textContent = driver.code;
    document.getElementById('tyreSelect').value = '';
    
    const modal = document.getElementById('pitModal');
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('pitModal');
    modal.classList.remove('active');
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderDrivers();
    
    document.getElementById('pitOutBtn').addEventListener('click', addTyre);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('pitModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('pitModal')) {
            closeModal();
        }
    });
});