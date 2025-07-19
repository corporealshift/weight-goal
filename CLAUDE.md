# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based weight tracking application built as a single-file component. The app helps users track their daily weight, eating habits, and workout routines with visual progress charts and data management features.

## Architecture

**Single Component Structure**: The entire application is contained in `index.ts` as a React TypeScript component with multiple sub-components:

- `WeightTrackerApp` - Main application component with state management
- `HomeView` - Dashboard with current stats, data entry form, and recent entries
- `ChartsView` - Visual progress charts using Recharts library
- `DataView` - Tabular data display with import/export functionality
- `Navigation` - Bottom navigation bar for view switching

**Key Dependencies**:
- React with hooks (useState, useEffect)
- Lucide React icons
- Recharts for data visualization
- Browser localStorage for data persistence

**Data Structure**: Each weight entry contains:
```typescript
{
  date: string,        // MM/DD/YYYY format
  weight: number,      // in pounds
  goal: number,        // calculated goal weight
  goodFood: boolean,   // ate well today
  workedOut: boolean   // exercised today
}
```

**Goal Calculation Logic**: Target weight is 160 lbs. Daily goal decreases by 0.2 lbs each day, regardless of weight entered.

## Key Features

- **Weight Tracking**: Daily weight entry with automatic goal calculation
- **Habit Tracking**: Boolean tracking for food quality and exercise
- **Data Visualization**: Line charts for weight vs goal, area charts for target progress
- **Data Management**: CSV import/export, individual entry deletion, bulk clear
- **Progress Analytics**: Success streaks, weekly trends, habit percentages
- **Local Storage**: Automatic data persistence in browser

## Development Notes

**No Build System**: This appears to be a standalone React component without a build setup. To run this application, you would typically need to integrate it into a React project with proper tooling.

**Browser Dependencies**: Uses browser APIs (localStorage, FileReader, Blob, URL) for data persistence and file operations.

**Sample Data**: Application initializes with sample data if no saved entries exist in localStorage.