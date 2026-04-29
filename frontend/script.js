document.addEventListener('DOMContentLoaded', () => {
    // --- 1. STATE & CONFIG ---
    let currentScreen = 'home';
    let history = JSON.parse(localStorage.getItem('crisis_history')) || [];
    let barChart, lineChart;

    const screens = {
        home: document.getElementById('home-screen'),
        input: document.getElementById('input-screen'),
        loading: document.getElementById('loading-screen'),
        result: document.getElementById('result-screen'),
        viz: document.getElementById('viz-screen'),
        history: document.getElementById('history-screen'),
        about: document.getElementById('about-screen'),
        login: document.getElementById('login-screen')
    };

    // --- 2. NAVIGATION ---
    const showScreen = (screenId) => {
        // Hide all screens
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        
        // Show target screen
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
            currentScreen = screenId;
            window.scrollTo(0, 0);
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.screen === screenId);
        });
    };

    // Nav Link Clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen(link.dataset.screen);
        });
    });

    // Logo Click -> Home
    document.getElementById('navLogo').addEventListener('click', () => showScreen('home'));

    // Start Button -> Input
    document.getElementById('startBtn').addEventListener('click', () => showScreen('input'));

    // --- 3. PREDICTION LOGIC ---
    const predictionForm = document.getElementById('predictionForm');
    
    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect inputs
        const data = {
            gdp: parseFloat(document.getElementById('gdp').value),
            inflation: parseFloat(document.getElementById('inflation').value),
            interest: parseFloat(document.getElementById('interest').value),
            exchange: parseFloat(document.getElementById('exchange').value),
            unemployment: parseFloat(document.getElementById('unemployment').value),
            moneySupply: parseFloat(document.getElementById('moneySupply').value),
            debt: parseFloat(document.getElementById('debt').value),
            timestamp: new Date().toLocaleString()
        };

        startProcessing(data);
    });

    const startProcessing = (data) => {
        showScreen('loading');
        let progress = 0;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => finalizePrediction(data), 500);
            }
            progressBar.style.width = `${progress}%`;
            progressText.innerText = `${Math.floor(progress)}%`;
        }, 300);
    };

    const finalizePrediction = (data) => {
        // Mock ML Logic
        // Low GDP, High Inflation, High Debt, High Unemployment = Higher Risk
        let riskScore = 0;
        
        // Normalized contributions
        riskScore += (3000 - data.gdp) / 100; // GDP penalty
        riskScore += data.inflation * 5;
        riskScore += data.debt * 0.5;
        riskScore += data.unemployment * 4;
        riskScore += data.interest * 2;

        const probability = Math.min(Math.max(riskScore / 2, 5), 98.5).toFixed(2);
        const isCrisis = probability > 60;

        // Update Result UI
        const resultCard = document.getElementById('resultCard');
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const riskLevel = document.getElementById('riskLevel');
        const probValue = document.getElementById('probabilityValue');
        const resultDesc = document.getElementById('resultDesc');

        probValue.innerText = `${probability}%`;
        
        if (isCrisis) {
            resultCard.classList.add('crisis');
            resultIcon.innerText = '⚠️';
            resultTitle.innerText = 'Crisis Detected';
            riskLevel.innerText = 'HIGH';
            riskLevel.style.color = 'var(--danger)';
            resultDesc.innerText = 'The model predicts a high probability of economic crisis. Immediate attention is recommended.';
        } else {
            resultCard.classList.remove('crisis');
            resultIcon.innerText = '✅';
            resultTitle.innerText = 'No Crisis';
            riskLevel.innerText = probability > 30 ? 'MODERATE' : 'LOW';
            riskLevel.style.color = probability > 30 ? 'var(--warning)' : 'var(--success)';
            resultDesc.innerText = 'The model predicts a low probability of economic crisis based on the given indicators.';
        }

        // Fill Summary
        const summaryList = document.getElementById('summaryList');
        summaryList.innerHTML = `
            <div class="summary-item"><span class="label">GDP (Billion USD)</span><span class="value">${data.gdp}</span></div>
            <div class="summary-item"><span class="label">Inflation Rate (%)</span><span class="value">${data.inflation}</span></div>
            <div class="summary-item"><span class="label">Interest Rate (%)</span><span class="value">${data.interest}</span></div>
            <div class="summary-item"><span class="label">Exchange Rate (USD)</span><span class="value">${data.exchange}</span></div>
            <div class="summary-item"><span class="label">Unemployment Rate (%)</span><span class="value">${data.unemployment}</span></div>
            <div class="summary-item"><span class="label">Money Supply (M2)</span><span class="value">${data.moneySupply}</span></div>
            <div class="summary-item"><span class="label">Government Debt (% of GDP)</span><span class="value">${data.debt}</span></div>
        `;

        // Save to history
        const historyItem = {
            ...data,
            probability,
            prediction: isCrisis ? 'Crisis' : 'No Crisis'
        };
        history.unshift(historyItem);
        localStorage.setItem('crisis_history', JSON.stringify(history.slice(0, 10)));
        updateHistoryTable();

        showScreen('result');
        initCharts(data, probability);
    };

    // --- 4. VISUALIZATIONS ---
    const initCharts = (data, probability) => {
        const barCtx = document.getElementById('barChart').getContext('2d');
        const lineCtx = document.getElementById('lineChart').getContext('2d');

        if (barChart) barChart.destroy();
        if (lineChart) lineChart.destroy();

        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['GDP', 'Inflation', 'Interest', 'Exchange'],
                datasets: [{
                    label: 'Indicator Comparison',
                    data: [data.gdp / 10, data.inflation * 10, data.interest * 10, data.exchange],
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'GDP Growth Trend',
                    data: [2100, 2250, 2400, 2350, 2450, data.gdp],
                    borderColor: '#2563eb',
                    tension: 0.3,
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Update Risk Pointer
        const pointer = document.getElementById('riskPointer');
        pointer.style.left = `${probability}%`;
    };

    // --- 5. HISTORY ---
    const updateHistoryTable = () => {
        const tbody = document.getElementById('historyBody');
        tbody.innerHTML = '';
        
        history.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.timestamp}</td>
                <td>${item.gdp}</td>
                <td>${item.inflation}%</td>
                <td>${item.interest}%</td>
                <td>${item.exchange}</td>
                <td><span class="status-tag ${item.prediction === 'Crisis' ? 'crisis' : 'no-crisis'}">${item.prediction}</span></td>
                <td>${item.probability}%</td>
            `;
            tbody.appendChild(row);
        });
    };

    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history?')) {
            history = [];
            localStorage.removeItem('crisis_history');
            updateHistoryTable();
        }
    });

    // --- 6. ACTION BUTTONS ---
    document.getElementById('viewVisualsBtn').addEventListener('click', () => showScreen('viz'));
    document.getElementById('predictAgainBtn').addEventListener('click', () => showScreen('input'));

    // --- 7. INITIALIZE ---
    updateHistoryTable();
    showScreen('home'); // Ensure we start at home
});

