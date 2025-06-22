import React from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { useTodos } from './hooks/useTodos';
import './App.css';

function App() {
  const {
    todos,
    loading,
    error,
    stats,
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    clearError
  } = useTodos();

  return (
    <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <KanbanBoard
          todos={todos}
          loading={loading}
          error={error}
          onCreateTodo={createTodo}
          onUpdateTodo={editTodo}
          onDeleteTodo={removeTodo}
          onToggleComplete={toggleComplete}
        />
        
        {/* 통계 정보 */}
        {!loading && !error && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              프로젝트 통계
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">전체</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">할 일</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">진행 중</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">완료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">높은 우선순위</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
