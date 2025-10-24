# React Components Documentation

This document describes all the React components in the Quiz Management System.

## 🏗️ Component Architecture

The application is built with a modular component architecture using React 18 with hooks and functional components.

## 📦 Core Components

### Layout Component
**File:** `src/components/Layout.js`

A wrapper component that provides consistent header, navigation, and footer across all pages.

**Props:**
- `title` (string): Page title to display in header
- `showBack` (boolean): Whether to show back to home link
- `children` (ReactNode): Content to render

**Usage:**
```jsx
<Layout title="🎯 Quiz Management System" showBack={true}>
  <div>Page content</div>
</Layout>
```

### Home Component
**File:** `src/components/Home.js`

Displays the list of available quizzes with modern card-based layout.

**Features:**
- Fetches quizzes from API
- Displays empty state when no quizzes
- Responsive grid layout
- Loading states

### Admin Component
**File:** `src/components/Admin.js`

Quiz creation interface with dynamic form management.

**Features:**
- Dynamic question addition/removal
- Multiple question types (MCQ, True/False, Text)
- Form validation
- Preview functionality
- Real-time feedback

### Quiz Component
**File:** `src/components/Quiz.js`

Quiz taking interface with progress tracking.

**Features:**
- Progress bar with real-time updates
- Smart validation
- Answer tracking
- Submission handling

### Results Component
**File:** `src/components/Results.js`

Displays quiz results with detailed breakdown.

**Features:**
- Score visualization
- Performance feedback
- Detailed answer review
- Retake functionality

## 🧩 Utility Components

### Question Component
**File:** `src/components/Question.js`

Reusable component for individual question management in admin interface.

**Props:**
- `question` (object): Question data
- `index` (number): Question index
- `onUpdate` (function): Update handler
- `onRemove` (function): Remove handler
- `onAddOption` (function): Add option handler
- `onRemoveOption` (function): Remove option handler
- `onUpdateOption` (function): Update option handler

### QuizCard Component
**File:** `src/components/QuizCard.js`

Card component for displaying quiz information.

**Props:**
- `quiz` (object): Quiz data
- `onTakeQuiz` (function): Optional click handler

### ProgressBar Component
**File:** `src/components/ProgressBar.js`

Visual progress indicator component.

**Props:**
- `current` (number): Current progress
- `total` (number): Total items
- `label` (string): Progress label

### Message Component
**File:** `src/components/Message.js`

Displays user messages with different types.

**Props:**
- `message` (string): Message text
- `type` (string): Message type ('info', 'success', 'error')
- `autoHide` (boolean): Auto-hide after duration
- `duration` (number): Hide duration in ms

### Loading Component
**File:** `src/components/Loading.js`

Loading spinner component.

**Props:**
- `message` (string): Loading message

## 🎨 Styling

Each component has its own CSS file for component-scoped styling:

- `Layout.css` - Layout and header styles
- `Home.css` - Home page specific styles
- `Admin.css` - Admin interface styles
- `Quiz.css` - Quiz taking styles
- `Results.css` - Results page styles
- `Question.css` - Question component styles
- `QuizCard.css` - Quiz card styles
- `ProgressBar.css` - Progress bar styles
- `Message.css` - Message component styles
- `Loading.css` - Loading component styles

## 🔧 Component Features

### State Management
- Uses React hooks (useState, useEffect)
- Local state for component data
- Props for parent-child communication

### Event Handling
- Form submissions
- User interactions
- API calls
- Navigation

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly interfaces

### Accessibility
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Focus management

## 🚀 Usage Examples

### Basic Layout
```jsx
import { Layout } from './components';

function MyPage() {
  return (
    <Layout title="My Page" showBack={true}>
      <div>Page content</div>
    </Layout>
  );
}
```

### Using Utility Components
```jsx
import { ProgressBar, Message, Loading } from './components';

function MyComponent() {
  return (
    <div>
      <ProgressBar current={5} total={10} />
      <Message message="Success!" type="success" />
      <Loading message="Loading..." />
    </div>
  );
}
```

## 📱 Responsive Behavior

All components are designed to work seamlessly across devices:

- **Desktop**: Full feature set with hover effects
- **Tablet**: Touch-optimized interactions
- **Mobile**: Simplified layouts with touch-friendly controls

## 🎯 Best Practices

1. **Component Composition**: Build complex UIs by combining simple components
2. **Props Validation**: Use TypeScript or PropTypes for type safety
3. **Performance**: Use React.memo for expensive components
4. **Accessibility**: Include ARIA labels and keyboard support
5. **Testing**: Write unit tests for component behavior

## 🔄 Component Lifecycle

Components follow React's lifecycle:

1. **Mounting**: Component creation and initial render
2. **Updating**: Re-renders when props or state change
3. **Unmounting**: Cleanup when component is removed

## 📊 Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Main Content
│   └── Footer
├── Home
│   ├── QuizCard (multiple)
│   └── EmptyState
├── Admin
│   ├── Question (multiple)
│   ├── Message
│   └── Form Controls
├── Quiz
│   ├── ProgressBar
│   └── Question Forms
└── Results
    ├── Score Display
    └── Results Table
```

This modular architecture makes the application maintainable, testable, and scalable.
