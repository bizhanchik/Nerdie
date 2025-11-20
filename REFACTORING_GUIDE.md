# Refactoring Guide

## Overview

This document describes the comprehensive refactoring performed to improve code organization, maintainability, and scalability.

## Results Summary

### File Size Reduction

**Before:**
- `HomeScreen.tsx`: 553 lines → **267 lines** (-52%)
- `LectureDetailScreen.tsx`: 604 lines → **157 lines** (-74%)
- `RecordScreen.tsx`: 312 lines → **132 lines** (-58%)

**Total reduction: 1,469 lines → 556 lines (-62%)**

### New Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── EditModal.tsx
│   │   ├── LectureCard.tsx
│   │   ├── FolderCard.tsx
│   │   ├── SwipeActions.tsx
│   │   └── FAB.tsx
│   ├── lecture/             # Lecture detail components
│   │   ├── LectureHeader.tsx
│   │   ├── TabBar.tsx
│   │   ├── SummaryTab.tsx
│   │   ├── FlashcardsTab.tsx
│   │   ├── NotesTab.tsx
│   │   ├── TranscriptTab.tsx
│   │   └── MoveFolderModal.tsx
│   ├── record/              # Recording components
│   │   ├── WaveformVisualizer.tsx
│   │   ├── RecordingHeader.tsx
│   │   ├── StopButton.tsx
│   │   └── ProcessingOverlay.tsx
│   └── ScreenWrapper.tsx    # Existing wrapper
├── hooks/                   # Custom React hooks
│   ├── useLectures.ts       # Lecture data management
│   ├── useFolders.ts        # Folder data management
│   └── useRecording.ts      # Audio recording logic
├── constants/               # Theme and constants
│   └── theme.ts             # Colors, spacing, typography, shadows
├── utils/                   # Utility functions
│   ├── dateUtils.ts         # Date formatting utilities
│   └── timeUtils.ts         # Duration formatting utilities
├── screens/                 # Screen components (simplified)
│   ├── HomeScreen.tsx
│   ├── LectureDetailScreen.tsx
│   ├── RecordScreen.tsx
│   ├── LessonsScreen.tsx
│   └── SettingsScreen.tsx
├── services/                # External services
│   ├── storage.ts
│   └── openai.ts
└── types/                   # TypeScript types
    └── index.ts
```

## Key Improvements

### 1. Custom Hooks
Extracted business logic into reusable hooks:
- **`useLectures`**: Manages lecture CRUD operations
- **`useFolders`**: Manages folder operations
- **`useRecording`**: Handles audio recording logic

### 2. Component Modularity
Split large screens into smaller, focused components:
- **Common components**: Reusable across the app
- **Feature-specific components**: Organized by feature (lecture, record)

### 3. Theme System
Centralized design system in `constants/theme.ts`:
- Colors with semantic naming
- Consistent spacing scale
- Typography system
- Shadow presets

### 4. Utility Functions
Extracted formatting logic:
- Date/time formatting
- Duration calculations
- Reusable across components

## Benefits

### For Developers
- **Easier to navigate**: Logical folder structure
- **Faster development**: Reusable components
- **Better testing**: Isolated business logic in hooks
- **Consistent styling**: Theme system prevents design drift

### For Scaling
- **Add new features**: Clear patterns to follow
- **Modify existing features**: Changes isolated to specific files
- **Team collaboration**: Easier to work on different parts
- **Code reuse**: Components and hooks are reusable

## Usage Examples

### Using Custom Hooks

```typescript
import { useLectures } from '../hooks/useLectures';

function MyComponent() {
  const { lectures, loadLectures, saveLecture, deleteLecture } = useLectures();

  useEffect(() => {
    loadLectures();
  }, []);

  // Use lectures data...
}
```

### Using Theme Constants

```typescript
import { colors, spacing, typography } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: colors.text.primary,
  },
});
```

### Using Reusable Components

```typescript
import { LectureCard } from '../components/common/LectureCard';
import { EditModal } from '../components/common/EditModal';

function MyScreen() {
  return (
    <>
      <LectureCard
        lecture={lecture}
        onPress={handlePress}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditModal
        visible={showModal}
        title="Edit Title"
        value={currentValue}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
}
```

## Next Steps for Scaling

### Potential Future Improvements

1. **Context API or State Management**
   - Add Redux or Zustand for global state
   - Share lecture/folder data across screens without prop drilling

2. **Testing**
   - Unit tests for hooks
   - Component tests for UI
   - Integration tests for screens

3. **Performance Optimization**
   - Memoization with React.memo
   - useMemo/useCallback for expensive operations
   - Virtual lists for large datasets

4. **Additional Features**
   - Add search functionality
   - Implement tags/categories
   - Add sorting/filtering options
   - Export/import functionality

5. **Code Quality**
   - Add ESLint configuration
   - Add Prettier for consistent formatting
   - Add Husky for pre-commit hooks
   - Add TypeScript strict mode

## File Organization Guidelines

### When to Create a New Component
- Component exceeds 200 lines
- Logic is used in multiple places
- Component has a single, clear responsibility

### When to Create a New Hook
- Logic is reused across multiple components
- Complex state management needs
- Side effects that should be isolated

### When to Add to Constants
- Values used in 3+ places
- Design tokens (colors, spacing, etc.)
- Configuration values

## Maintenance

### Adding a New Screen
1. Create screen file in `src/screens/`
2. Extract reusable parts to `src/components/`
3. Use existing hooks or create new ones
4. Use theme constants for styling

### Adding a New Feature
1. Identify reusable components
2. Create feature-specific folder if needed
3. Extract business logic to hooks
4. Keep components focused and small

### Modifying Existing Features
1. Find the relevant component/hook
2. Make changes in isolated location
3. Test affected screens
4. Update documentation if needed
