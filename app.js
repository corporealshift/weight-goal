// Weight Tracker Application - Vanilla JavaScript

class WeightTrackerApp {
    constructor() {
        this.currentView = 'home';
        this.entries = [];
        this.todayEntry = {
            date: new Date().toLocaleDateString('en-US'),
            weight: '',
            goodFood: null,
            workedOut: null
        };
        this.isLoaded = false;
        this.showDeleteConfirm = false;
        this.deleteIndex = null;
        this.showClearConfirm = false;
        this.showImportConfirm = false;
        this.importedData = [];
        this.charts = {};

        this.init();
    }

    init() {
        this.loadData();
        this.render();
        this.setupEventListeners();
    }

    loadData() {
        const savedEntries = localStorage.getItem('weightTrackerEntries');
        if (savedEntries) {
            this.entries = JSON.parse(savedEntries);
        } else {
            // Initialize with sample data if no saved data
            const sampleEntries = [
                { date: '7/16/2025', weight: 181.1, goal: 182, goodFood: true, workedOut: true },
                { date: '7/17/2025', weight: 181.9, goal: 182, goodFood: true, workedOut: false },
            ];
            this.entries = sampleEntries;
            localStorage.setItem('weightTrackerEntries', JSON.stringify(sampleEntries));
        }
        this.isLoaded = true;
    }

    saveData() {
        if (this.entries.length > 0 && this.isLoaded) {
            localStorage.setItem('weightTrackerEntries', JSON.stringify(this.entries));
        }
    }

    calculateGoal(newDay, previousGoal) {
        const targetWeight = 160;
	if (newDay) {
	     return Math.max(previousGoal - 0.2, targetWeight);
	}
	return Math.max(previousGoal, targetWeight);
    }

    handleSubmit() {
        if (!this.todayEntry.weight || this.todayEntry.goodFood === null || this.todayEntry.workedOut === null) {
            alert('Please fill in all fields');
            return;
        }

        const weight = parseFloat(this.todayEntry.weight);
        const lastGoal = this.entries.length > 0 ? this.entries[this.entries.length - 1].goal : 182;
	const lastDate = this.entries.length > 0 ? this.entries[this.entries.length - 1].date : "01/01/2025";
        const newGoal = this.calculateGoal(lastDate != this.todayEntry.date, lastGoal);

        const newEntry = {
            date: this.todayEntry.date,
            weight: weight,
            goal: newGoal,
            goodFood: this.todayEntry.goodFood,
            workedOut: this.todayEntry.workedOut
        };

        this.entries.push(newEntry);
        this.saveData();
        
        // Reset form
        this.todayEntry = {
            date: new Date().toLocaleDateString('en-US'),
            weight: '',
            goodFood: null,
            workedOut: null
        };

        this.render();
    }

    getStreakInfo() {
        if (this.entries.length === 0) return { onTrack: 0, total: 0 };
        
        let onTrackCount = 0;
        this.entries.forEach(entry => {
            if (entry.weight <= entry.goal) onTrackCount++;
        });
        
        return { onTrack: onTrackCount, total: this.entries.length };
    }

    getRecentTrend() {
        if (this.entries.length < 2) return 0;
        const recent = this.entries.slice(-7);
        return recent[recent.length - 1].weight - recent[0].weight;
    }

    exportData() {
        const csvContent = [
            ['Date', 'Weight', 'Goal', 'Good Food', 'Worked Out', 'On Track'].join(','),
            ...this.entries.map(entry => [
                entry.date,
                entry.weight,
                entry.goal.toFixed(1),
                entry.goodFood ? 'Yes' : 'No',
                entry.workedOut ? 'Yes' : 'No',
                entry.weight <= entry.goal ? 'Yes' : 'No'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'weight-tracker-data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target.result;
                const lines = csvText.split('\n');
                
                const parsedEntries = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(',');
                    if (values.length >= 5) {
                        const entry = {
                            date: values[0],
                            weight: parseFloat(values[1]),
                            goal: parseFloat(values[2]),
                            goodFood: values[3].toLowerCase() === 'yes',
                            workedOut: values[4].toLowerCase() === 'yes'
                        };
                        
                        if (!isNaN(entry.weight) && !isNaN(entry.goal) && entry.date) {
                            parsedEntries.push(entry);
                        }
                    }
                }
                
                if (parsedEntries.length > 0) {
                    this.importedData = parsedEntries;
                    this.showImportConfirm = true;
                    this.render();
                } else {
                    alert('No valid entries found in the CSV file. Please check the format.');
                }
            } catch (error) {
                alert('Error reading CSV file. Please check the file format.');
            }
        };
        
        reader.readAsText(file);
    }

    confirmImport() {
        this.entries = this.importedData;
        this.saveData();
        this.showImportConfirm = false;
        this.importedData = [];
        this.render();
    }

    cancelImport() {
        this.showImportConfirm = false;
        this.importedData = [];
        this.render();
    }

    deleteEntry(indexToDelete) {
        this.deleteIndex = indexToDelete;
        this.showDeleteConfirm = true;
        this.render();
    }

    confirmDelete() {
        if (this.deleteIndex !== null) {
            this.entries = this.entries.filter((_, index) => index !== this.deleteIndex);
            this.saveData();
        }
        this.showDeleteConfirm = false;
        this.deleteIndex = null;
        this.render();
    }

    cancelDelete() {
        this.showDeleteConfirm = false;
        this.deleteIndex = null;
        this.render();
    }

    clearData() {
        this.showClearConfirm = true;
        this.render();
    }

    confirmClear() {
        this.entries = [];
        localStorage.removeItem('weightTrackerEntries');
        this.showClearConfirm = false;
        this.render();
    }

    cancelClear() {
        this.showClearConfirm = false;
        this.render();
    }

    createIcon(iconName, className = 'w-5 h-5') {
        const iconElement = document.createElement('i');
        iconElement.setAttribute('data-lucide', iconName);
        iconElement.className = className;
        return iconElement;
    }

    renderHomeView() {
        const streak = this.getStreakInfo();
        const trend = this.getRecentTrend();
        const currentWeight = this.entries.length > 0 ? this.entries[this.entries.length - 1].weight : null;
        const currentGoal = this.entries.length > 0 ? this.entries[this.entries.length - 1].goal : null;
        const weightToLose = currentWeight ? currentWeight - 160 : 0;

        return `
            <!-- Header -->
            <div class="gradient-bg text-white p-6 rounded-b-3xl">
                <h1 class="text-2xl font-bold flex items-center gap-2">
                    <i data-lucide="target" class="w-6 h-6"></i>
                    Weight Goals
                </h1>
                ${currentWeight ? `
                    <div class="mt-4 flex justify-between">
                        <div>
                            <p class="text-blue-100 text-sm">Current</p>
                            <p class="text-xl font-bold">${currentWeight} lbs</p>
                        </div>
                        <div>
                            <p class="text-blue-100 text-sm">Goal</p>
                            <p class="text-xl font-bold">${currentGoal?.toFixed(1)} lbs</p>
                        </div>
                        <div>
                            <p class="text-blue-100 text-sm">To Target</p>
                            <p class="text-xl font-bold text-yellow-200">
                                ${weightToLose.toFixed(1)} lbs
                            </p>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Stats Cards -->
            <div class="p-4 -mt-6 relative z-10">
                <div class="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-4">
                    <div class="text-center">
                        <p class="text-2xl font-bold text-green-600">${streak.onTrack}</p>
                        <p class="text-sm text-gray-600">Days on Track</p>
                        <p class="text-xs text-gray-400">${streak.total > 0 ? ((streak.onTrack / streak.total) * 100).toFixed(0) : 0}% success</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold ${trend <= 0 ? 'text-green-600' : 'text-red-500'}">
                            ${trend > 0 ? '+' : ''}${trend.toFixed(1)}
                        </p>
                        <p class="text-sm text-gray-600">Weekly Trend</p>
                        <p class="text-xs text-gray-400">Last 7 days</p>
                    </div>
                </div>
            </div>

            <!-- Today's Entry Form -->
            <div class="p-4">
                <div class="bg-gray-50 rounded-2xl p-6">
                    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <i data-lucide="calendar" class="w-5 h-5"></i>
                        Today's Entry
                    </h2>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Weight (lbs)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                id="weight-input"
                                value="${this.todayEntry.weight}"
                                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                placeholder="Enter today's weight"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Did you eat well today?
                            </label>
                            <div class="flex gap-2">
                                <button
                                    id="good-food-yes"
                                    class="flex-1 p-3 rounded-xl border-2 transition-all ${
                                        this.todayEntry.goodFood === true 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }"
                                >
                                    <i data-lucide="check-circle" class="w-5 h-5 mx-auto mb-1"></i>
                                    Yes
                                </button>
                                <button
                                    id="good-food-no"
                                    class="flex-1 p-3 rounded-xl border-2 transition-all ${
                                        this.todayEntry.goodFood === false 
                                            ? 'border-red-500 bg-red-50 text-red-700' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }"
                                >
                                    <i data-lucide="x-circle" class="w-5 h-5 mx-auto mb-1"></i>
                                    No
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Did you work out today?
                            </label>
                            <div class="flex gap-2">
                                <button
                                    id="worked-out-yes"
                                    class="flex-1 p-3 rounded-xl border-2 transition-all ${
                                        this.todayEntry.workedOut === true 
                                            ? 'border-green-500 bg-green-50 text-green-700' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }"
                                >
                                    <i data-lucide="check-circle" class="w-5 h-5 mx-auto mb-1"></i>
                                    Yes
                                </button>
                                <button
                                    id="worked-out-no"
                                    class="flex-1 p-3 rounded-xl border-2 transition-all ${
                                        this.todayEntry.workedOut === false 
                                            ? 'border-red-500 bg-red-50 text-red-700' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }"
                                >
                                    <i data-lucide="x-circle" class="w-5 h-5 mx-auto mb-1"></i>
                                    No
                                </button>
                            </div>
                        </div>

                        <button
                            id="submit-entry"
                            class="w-full gradient-bg text-white p-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <i data-lucide="plus" class="w-5 h-5"></i>
                            Log Today's Data
                        </button>
                    </div>
                </div>
            </div>

            <!-- Recent Entries -->
            <div class="p-4 pb-20">
                <h3 class="text-lg font-semibold mb-3">Recent Entries</h3>
                <div class="space-y-2">
                    ${this.entries.slice(-5).reverse().map((entry, index) => `
                        <div class="bg-white rounded-xl p-4 shadow-sm border">
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="font-medium">${entry.date}</p>
                                    <p class="text-sm text-gray-600">
                                        ${entry.weight} lbs → Goal: ${entry.goal.toFixed(1)} lbs
                                    </p>
                                </div>
                                <div class="flex gap-2">
                                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        entry.goodFood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }">
                                        ${entry.goodFood ? '🥗' : '🍕'}
                                    </span>
                                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        entry.workedOut ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }">
                                        ${entry.workedOut ? '💪' : '🛋️'}
                                    </span>
                                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        entry.weight <= entry.goal ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }">
                                        ${entry.weight <= entry.goal ? '✓' : '!'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderChartsView() {
        return `
            <div class="p-4 pb-20">
                <h2 class="text-2xl font-bold mb-6">Progress Charts</h2>
                
                ${this.entries.length > 0 ? `
                    <div class="space-y-6">
                        <!-- Weight Progress Chart -->
                        <div class="bg-white rounded-2xl p-4 shadow-sm">
                            <h3 class="text-lg font-semibold mb-4">Weight vs Goal</h3>
                            <div class="chart-container">
                                <canvas id="weight-chart"></canvas>
                            </div>
                        </div>

                        <!-- Progress to Target -->
                        <div class="bg-white rounded-2xl p-4 shadow-sm">
                            <h3 class="text-lg font-semibold mb-4">Progress to Target (160 lbs)</h3>
                            <div class="chart-container">
                                <canvas id="target-chart"></canvas>
                            </div>
                        </div>

                        <!-- Habits Summary -->
                        <div class="bg-white rounded-2xl p-4 shadow-sm">
                            <h3 class="text-lg font-semibold mb-4">Habits Summary</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-green-600">
                                        ${this.entries.filter(e => e.goodFood).length}
                                    </p>
                                    <p class="text-sm text-gray-600">Good Food Days</p>
                                    <p class="text-xs text-gray-400">
                                        ${((this.entries.filter(e => e.goodFood).length / this.entries.length) * 100).toFixed(0)}%
                                    </p>
                                </div>
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-blue-600">
                                        ${this.entries.filter(e => e.workedOut).length}
                                    </p>
                                    <p class="text-sm text-gray-600">Workout Days</p>
                                    <p class="text-xs text-gray-400">
                                        ${((this.entries.filter(e => e.workedOut).length / this.entries.length) * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="text-center py-12">
                        <p class="text-gray-500">No data to display yet. Start logging your weight to see charts!</p>
                    </div>
                `}
            </div>
        `;
    }

    renderDataView() {
        return `
            <div class="p-4 pb-20">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Data View</h2>
                    <div class="flex gap-2 flex-wrap">
                        <!-- Import Button -->
                        <input
                            type="file"
                            accept=".csv"
                            class="hidden"
                            id="csv-import"
                        />
                        <label
                            for="csv-import"
                            class="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer hover:bg-blue-700"
                            title="Import CSV file"
                        >
                            <i data-lucide="upload" class="w-4 h-4"></i>
                            Import CSV
                        </label>
                        <!-- Export Button -->
                        <button
                            id="export-data"
                            class="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                            title="Export CSV file"
                        >
                            <i data-lucide="download" class="w-4 h-4"></i>
                            Export CSV
                        </button>
                        <!-- Clear Button -->
                        <button
                            id="clear-data"
                            class="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                            title="Clear all data"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                ${this.entries.length > 0 ? `
                    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workout</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    ${this.entries.slice().reverse().map((entry, displayIndex) => {
                                        const originalIndex = this.entries.length - 1 - displayIndex;
                                        return `
                                            <tr class="hover:bg-gray-50">
                                                <td class="px-4 py-3 text-sm">${entry.date}</td>
                                                <td class="px-4 py-3 text-sm font-medium">${entry.weight} lbs</td>
                                                <td class="px-4 py-3 text-sm">${entry.goal.toFixed(1)} lbs</td>
                                                <td class="px-4 py-3 text-sm">
                                                    <span class="inline-flex px-2 py-1 text-xs rounded-full ${
                                                        entry.goodFood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }">
                                                        ${entry.goodFood ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td class="px-4 py-3 text-sm">
                                                    <span class="inline-flex px-2 py-1 text-xs rounded-full ${
                                                        entry.workedOut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }">
                                                        ${entry.workedOut ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td class="px-4 py-3 text-sm">
                                                    <span class="inline-flex px-2 py-1 text-xs rounded-full ${
                                                        entry.weight <= entry.goal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }">
                                                        ${entry.weight <= entry.goal ? 'On Track' : 'Above Goal'}
                                                    </span>
                                                </td>
                                                <td class="px-4 py-3 text-sm">
                                                    <button
                                                        class="delete-entry text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                                                        data-index="${originalIndex}"
                                                        title="Delete entry"
                                                    >
                                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div class="text-center py-12">
                        <p class="text-gray-500">No data to display yet. Start logging your weight!</p>
                    </div>
                `}
            </div>
        `;
    }

    renderNavigation() {
        return `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                <div class="mx-auto flex justify-around">
                    <button
                        id="nav-home"
                        class="flex flex-col items-center py-2 px-4 rounded-lg ${
                            this.currentView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }"
                    >
                        <i data-lucide="home" class="w-5 h-5"></i>
                        <span class="text-xs mt-1">Home</span>
                    </button>
                    <button
                        id="nav-charts"
                        class="flex flex-col items-center py-2 px-4 rounded-lg ${
                            this.currentView === 'charts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }"
                    >
                        <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
                        <span class="text-xs mt-1">Charts</span>
                    </button>
                    <button
                        id="nav-data"
                        class="flex flex-col items-center py-2 px-4 rounded-lg ${
                            this.currentView === 'data' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }"
                    >
                        <i data-lucide="list" class="w-5 h-5"></i>
                        <span class="text-xs mt-1">Data</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderModals() {
        let modals = '';

        if (this.showDeleteConfirm) {
            modals += `
                <div id="delete-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
                        <h3 class="text-lg font-semibold mb-4">Delete Entry</h3>
                        <p class="text-gray-600 mb-6">
                            Are you sure you want to delete this entry? This cannot be undone.
                        </p>
                        <div class="flex gap-3">
                            <button
                                id="cancel-delete"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-delete"
                                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this.showClearConfirm) {
            modals += `
                <div id="clear-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
                        <h3 class="text-lg font-semibold mb-4">Clear All Data</h3>
                        <p class="text-gray-600 mb-6">
                            Are you sure you want to clear all data? This will permanently delete all your weight tracking entries and cannot be undone.
                        </p>
                        <div class="flex gap-3">
                            <button
                                id="cancel-clear"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-clear"
                                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this.showImportConfirm) {
            modals += `
                <div id="import-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
                        <h3 class="text-lg font-semibold mb-4">Import Data</h3>
                        <p class="text-gray-600 mb-4">
                            Found ${this.importedData.length} entries to import. This will replace all current data.
                        </p>
                        <div class="bg-gray-50 rounded-lg p-3 mb-6 max-h-32 overflow-y-auto">
                            <p class="text-sm font-medium mb-2">Preview:</p>
                            ${this.importedData.slice(0, 3).map(entry => `
                                <p class="text-xs text-gray-600">
                                    ${entry.date}: ${entry.weight}lbs → ${entry.goal}lbs
                                </p>
                            `).join('')}
                            ${this.importedData.length > 3 ? `
                                <p class="text-xs text-gray-500">...and ${this.importedData.length - 3} more</p>
                            ` : ''}
                        </div>
                        <div class="flex gap-3">
                            <button
                                id="cancel-import"
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-import"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        return modals;
    }

    createCharts() {
        if (this.currentView === 'charts' && this.entries.length > 0) {
            setTimeout(() => {
                // Weight vs Goal Chart
                const weightCtx = document.getElementById('weight-chart');
                if (weightCtx && !this.charts.weightChart) {
                    const chartData = this.entries.map(entry => ({
                        date: entry.date.split('/').slice(0, 2).join('/'),
                        weight: entry.weight,
                        goal: entry.goal
                    }));

                    this.charts.weightChart = new Chart(weightCtx, {
                        type: 'line',
                        data: {
                            labels: chartData.map(d => d.date),
                            datasets: [
                                {
                                    label: 'Weight',
                                    data: chartData.map(d => d.weight),
                                    borderColor: '#3b82f6',
                                    backgroundColor: '#3b82f6',
                                    borderWidth: 3,
                                    fill: false
                                },
                                {
                                    label: 'Goal',
                                    data: chartData.map(d => d.goal),
                                    borderColor: '#10b981',
                                    backgroundColor: '#10b981',
                                    borderWidth: 2,
                                    borderDash: [5, 5],
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: false
                                }
                            }
                        }
                    });
                }

                // Target Progress Chart
                const targetCtx = document.getElementById('target-chart');
                if (targetCtx && !this.charts.targetChart) {
                    const chartData = this.entries.map(entry => ({
                        date: entry.date.split('/').slice(0, 2).join('/'),
                        weight: entry.weight,
                        goal: entry.goal
                    }));
                    this.charts.targetChart = new Chart(targetCtx, {
                        type: 'line',
                        data: {
                            labels: chartData.map(d => d.date),
                            datasets: [
                                {
                                    label: 'Weight',
                                    data: chartData.map(d => d.weight),
                                    borderColor: '#8884d8',
                                    backgroundColor: 'rgba(136, 132, 216, 0.3)',
                                    fill: true
                                },
                                {
                                    label: 'Target (160 lbs)',
                                    data: new Array(chartData.length).fill(160),
                                    borderColor: '#ef4444',
                                    backgroundColor: '#ef4444',
                                    borderWidth: 2,
                                    borderDash: [10, 5],
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    min: 155
                                }
                            }
                        }
                    });
                }
            }, 100);
        }
    }

    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    render() {
        const app = document.getElementById('app');
        let content = '';

        switch (this.currentView) {
            case 'home':
                content = this.renderHomeView();
                break;
            case 'charts':
                content = this.renderChartsView();
                break;
            case 'data':
                content = this.renderDataView();
                break;
        }

        content += this.renderNavigation();
        content += this.renderModals();

        app.innerHTML = content;

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Destroy existing charts before creating new ones
        this.destroyCharts();
        this.createCharts();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Navigation
            if (e.target.id === 'nav-home' || e.target.closest('#nav-home')) {
                this.currentView = 'home';
                this.render();
            } else if (e.target.id === 'nav-charts' || e.target.closest('#nav-charts')) {
                this.currentView = 'charts';
                this.render();
            } else if (e.target.id === 'nav-data' || e.target.closest('#nav-data')) {
                this.currentView = 'data';
                this.render();
            }

            // Home view form controls
            if (e.target.id === 'good-food-yes') {
                this.todayEntry.goodFood = true;
                this.render();
            } else if (e.target.id === 'good-food-no') {
                this.todayEntry.goodFood = false;
                this.render();
            } else if (e.target.id === 'worked-out-yes') {
                this.todayEntry.workedOut = true;
                this.render();
            } else if (e.target.id === 'worked-out-no') {
                this.todayEntry.workedOut = false;
                this.render();
            } else if (e.target.id === 'submit-entry') {
                this.handleSubmit();
            }

            // Data view controls
            if (e.target.id === 'export-data') {
                this.exportData();
            } else if (e.target.id === 'clear-data') {
                this.clearData();
            } else if (e.target.classList.contains('delete-entry') || e.target.closest('.delete-entry')) {
                const button = e.target.classList.contains('delete-entry') ? e.target : e.target.closest('.delete-entry');
                const index = parseInt(button.dataset.index);
                this.deleteEntry(index);
            }

            // Modal controls
            if (e.target.id === 'confirm-delete') {
                this.confirmDelete();
            } else if (e.target.id === 'cancel-delete') {
                this.cancelDelete();
            } else if (e.target.id === 'confirm-clear') {
                this.confirmClear();
            } else if (e.target.id === 'cancel-clear') {
                this.cancelClear();
            } else if (e.target.id === 'confirm-import') {
                this.confirmImport();
            } else if (e.target.id === 'cancel-import') {
                this.cancelImport();
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'weight-input') {
                this.todayEntry.weight = e.target.value;
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'csv-import') {
                const file = e.target.files[0];
                if (file) {
                    this.importData(file);
                }
            }
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeightTrackerApp();
});
