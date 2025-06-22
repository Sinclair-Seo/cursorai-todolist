import React from 'react';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import './App.css';

function App() {
  const {
    todos,
    loading,
    error,
    filter,
    sort,
    stats,
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    updateFilter,
    updateSort,
    clearError
  } = useTodos();

  return (
    <div className="App">
      <TodoList
        todos={todos}
        loading={loading}
        error={error}
        onCreateTodo={createTodo}
        onEditTodo={editTodo}
        onDeleteTodo={removeTodo}
        onToggleComplete={toggleComplete}
        onUpdateFilter={updateFilter}
        onUpdateSort={updateSort}
        filter={filter}
        sort={sort}
        stats={stats}
        onClearError={clearError}
      />
    </div>
  );
}

export default App;
