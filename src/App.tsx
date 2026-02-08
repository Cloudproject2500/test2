import { useState } from 'react';
import Dashboard from './components/Dashboard';
import SimulationDashboard from './components/SimulationDashboard';
import Sidebar from './components/Sidebar';
import Inbox from './components/Inbox';
import HybridCalendar from './components/HybridCalendar';
import CoursesView from './components/CoursesView';
import DeadlinesView from './components/DeadlinesView';
import PersonalTodoView from './components/PersonalTodoView';
import type { LifePage, PersonalTodo } from './types';

function App() {
  const [roomId, setRoomId] = useState<string>(localStorage.getItem('taskmate_room_id') || '');
  const [currentView, setCurrentView] = useState('dashboard');

  const initialLifePages: LifePage[] = [
    { id: 'lifestyle', name: 'Lifestyle', icon: '☘️', type: 'default' },
    { id: 'fitness', name: 'Fitness', icon: '💪', type: 'default' },
    { id: 'hobbies', name: 'Hobbies', icon: '🎨', type: 'default' }
  ];

  const [lifePages, setLifePages] = useState<LifePage[]>(() => {
    const saved = localStorage.getItem('taskmate_life_pages');
    return saved ? JSON.parse(saved) : initialLifePages;
  });

  const [personalTodos, setPersonalTodos] = useState<PersonalTodo[]>(() => {
    const saved = localStorage.getItem('taskmate_personal_todos');
    return saved ? JSON.parse(saved) : [];
  });

  const saveTodos = (updated: PersonalTodo[]) => {
    setPersonalTodos(updated);
    localStorage.setItem('taskmate_personal_todos', JSON.stringify(updated));
  };

  const handleAddTodo = (pageId: string, text: string, options: Partial<PersonalTodo> = {}) => {
    const newTodo: PersonalTodo = {
      id: Math.random().toString(36).substr(2, 9),
      pageId,
      text,
      completed: false,
      ...options
    };
    saveTodos([...personalTodos, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    const updated = personalTodos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTodos(updated);
  };

  const handleUpdateTodoProgress = (id: string, progress: number) => {
    const updated = personalTodos.map(t => t.id === id ? { ...t, progress } : t);
    saveTodos(updated);
  };

  const handleDeleteTodo = (id: string) => {
    const updated = personalTodos.filter(t => t.id !== id);
    saveTodos(updated);
  };

  const handleApplyTemplate = (pageId: string, tasks: { text: string, icon: string, goal?: number }[]) => {
    const newTasks: PersonalTodo[] = tasks.map(t => ({
      id: Math.random().toString(36).substr(2, 9),
      pageId,
      text: t.text,
      icon: t.icon,
      completed: false,
      progress: t.goal ? 0 : undefined,
      goal: t.goal
    }));
    saveTodos([...personalTodos, ...newTasks]);
  };

  const handleAddLifePage = (name: string) => {
    const newPage: LifePage = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      icon: '📄',
      type: 'custom'
    };
    const updated = [...lifePages, newPage];
    setLifePages(updated);
    localStorage.setItem('taskmate_life_pages', JSON.stringify(updated));
  };

  const handleDeleteLifePage = (id: string) => {
    const updated = lifePages.filter(p => p.id !== id);
    setLifePages(updated);
    localStorage.setItem('taskmate_life_pages', JSON.stringify(updated));
    if (currentView === id) setCurrentView('dashboard');
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    localStorage.setItem('taskmate_room_id', id);
  };

  const handleLeaveRoom = () => {
    setRoomId('');
    localStorage.removeItem('taskmate_room_id');
  };

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <Inbox />;
      case 'calendar':
        return <HybridCalendar />;
      case 'courses':
        return <CoursesView />;
      case 'deadlines':
        return <DeadlinesView roomId={roomId} />;
      case 'simulation': // New Simulation View
        return <SimulationDashboard />;
      default:
        const matchedPage = lifePages.find(p => p.id === currentView);
        if (matchedPage) {
          return (
            <PersonalTodoView
              page={matchedPage}
              todos={personalTodos.filter(t => t.pageId === matchedPage.id)}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onUpdateProgress={handleUpdateTodoProgress}
              onDeleteTodo={handleDeleteTodo}
              onApplyTemplate={handleApplyTemplate}
            />
          );
        }
        return <Dashboard
          roomId={roomId}
          lifePages={lifePages}
          personalTodos={personalTodos}
          onViewChange={setCurrentView}
          onJoinRoom={handleJoinRoom}
        />;
    }
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <Sidebar
        roomId={roomId}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
        currentView={currentView}
        onViewChange={setCurrentView}
        lifePages={lifePages}
        onAddLifePage={handleAddLifePage}
        onDeleteLifePage={handleDeleteLifePage}
      />
      {renderView()}
    </div>
  );
}

export default App;
