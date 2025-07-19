import React, { useState, useEffect } from 'react';
import { Calendar, TrendingDown, Target, Plus, CheckCircle, XCircle, BarChart3, List, Home, Download, Trash2, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Home View Component (moved outside to prevent recreation)
const HomeView = ({ 
  currentWeight, 
  currentGoal, 
  weightToLose, 
  streak, 
  trend, 
  todayEntry, 
  setTodayEntry, 
  handleSubmit, 
  entries 
}) => (
  <>
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-b-3xl">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Target className="w-6 h-6" />
        Weight Goals
      </h1>
      {currentWeight && (
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-blue-100 text-sm">Current</p>
            <p className="text-xl font-bold">{currentWeight} lbs</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Goal</p>
            <p className="text-xl font-bold">{currentGoal?.toFixed(1)} lbs</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">To Target</p>
            <p className="text-xl font-bold text-yellow-200">
              {weightToLose.toFixed(1)} lbs
            </p>
          </div>
        </div>
      )}
    </div>

    {/* Stats Cards */}
    <div className="p-4 -mt-6 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{streak.onTrack}</p>
          <p className="text-sm text-gray-600">Days on Track</p>
          <p className="text-xs text-gray-400">{streak.total > 0 ? ((streak.onTrack / streak.total) * 100).toFixed(0) : 0}% success</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${trend <= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Weekly Trend</p>
          <p className="text-xs text-gray-400">Last 7 days</p>
        </div>
      </div>
    </div>

    {/* Today's Entry Form */}
    <div className="p-4">
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Entry
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              value={todayEntry.weight}
              onChange={(e) => setTodayEntry(prev => ({...prev, weight: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter today's weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did you eat well today?
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTodayEntry(prev => ({...prev, goodFood: true}))}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  todayEntry.goodFood === true 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                Yes
              </button>
              <button
                onClick={() => setTodayEntry(prev => ({...prev, goodFood: false}))}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  todayEntry.goodFood === false 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <XCircle className="w-5 h-5 mx-auto mb-1" />
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did you work out today?
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTodayEntry(prev => ({...prev, workedOut: true}))}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  todayEntry.workedOut === true 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                Yes
              </button>
              <button
                onClick={() => setTodayEntry(prev => ({...prev, workedOut: false}))}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  todayEntry.workedOut === false 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <XCircle className="w-5 h-5 mx-auto mb-1" />
                No
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Log Today's Data
          </button>
        </div>
      </div>
    </div>

    {/* Recent Entries */}
    <div className="p-4 pb-20">
      <h3 className="text-lg font-semibold mb-3">Recent Entries</h3>
      <div className="space-y-2">
        {entries.slice(-5).reverse().map((entry, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{entry.date}</p>
                <p className="text-sm text-gray-600">
                  {entry.weight} lbs → Goal: {entry.goal.toFixed(1)} lbs
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  entry.goodFood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {entry.goodFood ? '🥗' : '🍕'}
                </span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  entry.workedOut ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {entry.workedOut ? '💪' : '🛋️'}
                </span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  entry.weight <= entry.goal ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {entry.weight <= entry.goal ? '✓' : '!'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// Charts View Component
const ChartsView = ({ entries }) => (
  <div className="p-4 pb-20">
    <h2 className="text-2xl font-bold mb-6">Progress Charts</h2>
    
    {entries.length > 0 ? (
      <div className="space-y-6">
        {/* Weight Progress Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Weight vs Goal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries.map(entry => ({
                date: entry.date.split('/').slice(0, 2).join('/'),
                weight: entry.weight,
                goal: entry.goal
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Weight"
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Goal"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress to Target */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Progress to Target (160 lbs)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={entries.map(entry => ({
                date: entry.date.split('/').slice(0, 2).join('/'),
                weight: entry.weight,
                goal: entry.goal
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[155, 'dataMax + 2']} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.3}
                  name="Weight"
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 160} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  name="Target (160 lbs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habits Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Habits Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {entries.filter(e => e.goodFood).length}
              </p>
              <p className="text-sm text-gray-600">Good Food Days</p>
              <p className="text-xs text-gray-400">
                {((entries.filter(e => e.goodFood).length / entries.length) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {entries.filter(e => e.workedOut).length}
              </p>
              <p className="text-sm text-gray-600">Workout Days</p>
              <p className="text-xs text-gray-400">
                {((entries.filter(e => e.workedOut).length / entries.length) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500">No data to display yet. Start logging your weight to see charts!</p>
      </div>
    )}
  </div>
);

// Data View Component
const DataView = ({ entries, exportData, clearData, deleteEntry, importData }) => (
  <div className="p-4 pb-20">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Data View</h2>
      <div className="flex gap-2">
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        <button
          onClick={clearData}
          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
        >
          Clear All
        </button>
      </div>
    </div>

    {entries.length > 0 ? (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workout</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.slice().reverse().map((entry, displayIndex) => {
                // Calculate the original index for deletion (since we reversed the array)
                const originalIndex = entries.length - 1 - displayIndex;
                return (
                  <tr key={`${entry.date}-${entry.weight}-${originalIndex}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{entry.date}</td>
                    <td className="px-4 py-3 text-sm font-medium">{entry.weight} lbs</td>
                    <td className="px-4 py-3 text-sm">{entry.goal.toFixed(1)} lbs</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        entry.goodFood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.goodFood ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        entry.workedOut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.workedOut ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        entry.weight <= entry.goal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.weight <= entry.goal ? 'On Track' : 'Above Goal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => deleteEntry(originalIndex)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500">No data to display yet. Start logging your weight!</p>
      </div>
    )}
  </div>
);

const WeightTrackerApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState({
    date: new Date().toLocaleDateString('en-US'),
    weight: '',
    goodFood: null,
    workedOut: null
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importedData, setImportedData] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('weightTrackerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      // Initialize with sample data if no saved data
      const sampleEntries = [
        { date: '7/16/2025', weight: 181.1, goal: 182, goodFood: true, workedOut: true },
        { date: '7/17/2025', weight: 181.9, goal: 182, goodFood: true, workedOut: false },
      ];
      setEntries(sampleEntries);
      localStorage.setItem('weightTrackerEntries', JSON.stringify(sampleEntries));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0 && isLoaded) {
      localStorage.setItem('weightTrackerEntries', JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const calculateGoal = (currentWeight, previousGoal) => {
    // Goal is to reach 160 lbs, decrease by 0.3 per day if on track
    const targetWeight = 160;
    if (currentWeight <= previousGoal && previousGoal > targetWeight) {
      return Math.max(previousGoal - 0.3, targetWeight);
    }
    return Math.max(previousGoal, targetWeight);
  };

  const handleSubmit = () => {
    if (!todayEntry.weight || todayEntry.goodFood === null || todayEntry.workedOut === null) {
      alert('Please fill in all fields');
      return;
    }

    const weight = parseFloat(todayEntry.weight);
    const lastGoal = entries.length > 0 ? entries[entries.length - 1].goal : 182;
    const newGoal = calculateGoal(weight, lastGoal);

    const newEntry = {
      date: todayEntry.date,
      weight: weight,
      goal: newGoal,
      goodFood: todayEntry.goodFood,
      workedOut: todayEntry.workedOut
    };

    setEntries([...entries, newEntry]);
    
    // Reset form
    setTodayEntry({
      date: new Date().toLocaleDateString('en-US'),
      weight: '',
      goodFood: null,
      workedOut: null
    });
  };

  const getStreakInfo = () => {
    if (entries.length === 0) return { onTrack: 0, total: 0 };
    
    let onTrackCount = 0;
    entries.forEach(entry => {
      if (entry.weight <= entry.goal) onTrackCount++;
    });
    
    return { onTrack: onTrackCount, total: entries.length };
  };

  const getRecentTrend = () => {
    if (entries.length < 2) return 0;
    const recent = entries.slice(-7); // Last 7 entries
    return recent[recent.length - 1].weight - recent[0].weight;
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Weight', 'Goal', 'Good Food', 'Worked Out', 'On Track'].join(','),
      ...entries.map(entry => [
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
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        // Parse CSV data
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
            
            // Validate the entry
            if (!isNaN(entry.weight) && !isNaN(entry.goal) && entry.date) {
              parsedEntries.push(entry);
            }
          }
        }
        
        if (parsedEntries.length > 0) {
          setImportedData(parsedEntries);
          setShowImportConfirm(true);
        } else {
          alert('No valid entries found in the CSV file. Please check the format.');
        }
      } catch (error) {
        alert('Error reading CSV file. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  const confirmImport = () => {
    setEntries(importedData);
    setShowImportConfirm(false);
    setImportedData([]);
  };

  const cancelImport = () => {
    setShowImportConfirm(false);
    setImportedData([]);
  };

  const deleteEntry = (indexToDelete) => {
    setDeleteIndex(indexToDelete);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedEntries = entries.filter((_, index) => index !== deleteIndex);
      setEntries(updatedEntries);
    }
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const clearData = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setEntries([]);
    localStorage.removeItem('weightTrackerEntries');
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  const streak = getStreakInfo();
  const trend = getRecentTrend();
  const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : null;
  const currentGoal = entries.length > 0 ? entries[entries.length - 1].goal : null;
  const weightToLose = currentWeight ? currentWeight - 160 : 0;

  // Navigation component
  const Navigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto flex justify-around">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg ${
            currentView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setCurrentView('charts')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg ${
            currentView === 'charts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs mt-1">Charts</span>
        </button>
        <button
          onClick={() => setCurrentView('data')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg ${
            currentView === 'data' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
          }`}
        >
          <List className="w-5 h-5" />
          <span className="text-xs mt-1">Data</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {currentView === 'home' && (
        <HomeView
          currentWeight={currentWeight}
          currentGoal={currentGoal}
          weightToLose={weightToLose}
          streak={streak}
          trend={trend}
          todayEntry={todayEntry}
          setTodayEntry={setTodayEntry}
          handleSubmit={handleSubmit}
          entries={entries}
        />
      )}
      {currentView === 'charts' && <ChartsView entries={entries} />}
      {currentView === 'data' && (
        <div className="p-4 pb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Data View</h2>
            <div className="flex gap-2 flex-wrap">
              {/* Import Button */}
              <input
                type="file"
                accept=".csv"
                onChange={importData}
                className="hidden"
                id="csv-import"
              />
              <label
                htmlFor="csv-import"
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer hover:bg-blue-700"
                title="Import CSV file"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </label>
              {/* Export Button */}
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                title="Export CSV file"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              {/* Clear Button */}
              <button
                onClick={clearData}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                title="Clear all data"
              >
                Clear All
              </button>
            </div>
          </div>

          {entries.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workout</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {entries.slice().reverse().map((entry, displayIndex) => {
                      // Calculate the original index for deletion (since we reversed the array)
                      const originalIndex = entries.length - 1 - displayIndex;
                      return (
                        <tr key={`${entry.date}-${entry.weight}-${originalIndex}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{entry.date}</td>
                          <td className="px-4 py-3 text-sm font-medium">{entry.weight} lbs</td>
                          <td className="px-4 py-3 text-sm">{entry.goal.toFixed(1)} lbs</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              entry.goodFood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.goodFood ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              entry.workedOut ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.workedOut ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              entry.weight <= entry.goal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.weight <= entry.goal ? 'On Track' : 'Above Goal'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => deleteEntry(originalIndex)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No data to display yet. Start logging your weight!</p>
            </div>
          )}
        </div>
      )}
      <Navigation />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Entry</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this entry? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Clear All Data</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to clear all data? This will permanently delete all your weight tracking entries and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelClear}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Confirmation Modal */}
      {showImportConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Import Data</h3>
            <p className="text-gray-600 mb-4">
              Found {importedData.length} entries to import. This will replace all current data.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6 max-h-32 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Preview:</p>
              {importedData.slice(0, 3).map((entry, index) => (
                <p key={index} className="text-xs text-gray-600">
                  {entry.date}: {entry.weight}lbs → {entry.goal}lbs
                </p>
              ))}
              {importedData.length > 3 && (
                <p className="text-xs text-gray-500">...and {importedData.length - 3} more</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelImport}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTrackerApp;