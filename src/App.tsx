import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import TutorialOverlay from './components/TutorialOverlay';

import Sidebar from './components/Sidebar';
import Inbox from './components/Inbox';
import HybridCalendar from './components/HybridCalendar';
import CoursesView from './components/CoursesView';
import DeadlinesView from './components/DeadlinesView';
import PersonalTodoView from './components/PersonalTodoView';
import type { LifePage, PersonalTodo, CalendarEvent } from './types';

function App() {

  const [currentView, setCurrentView] = useState('dashboard');
  const [showTutorial, setShowTutorial] = useState(false);

  const [theme] = useState(() => {
    return localStorage.getItem('taskmate_theme') || 'glass';
  });

  const [personalColor, setPersonalColor] = useState(() => localStorage.getItem('taskmate_personal_color') || '#22c55e');
  const [workspaceColor, setWorkspaceColor] = useState(() => localStorage.getItem('taskmate_workspace_color') || '#3b82f6');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskmate_theme', theme);
  }, [theme]);

  useEffect(() => {
    const checkTutorial = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_seen_tutorial')
          .eq('user_id', user.id)
          .single();
        if (profile && profile.has_seen_tutorial === false) {
          setShowTutorial(true);
        }
      }
    };
    checkTutorial();
  }, []);

  const handleCloseTutorial = async () => {
    setShowTutorial(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ has_seen_tutorial: true }).eq('user_id', user.id);
    }
  };

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

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('taskmate_calendar_events');
    if (saved) return JSON.parse(saved);

    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    return [
      { id: 'c1', title: 'TEK Club meeting', date: `${year}-${month}-18`, time: '12:00 PM', type: 'personal' },
      { id: 'c2', title: 'Business Night', date: `${year}-${month}-18`, time: '06:30 PM', type: 'workspace' },
      { id: 'c3', title: 'STUCO Team dinner', date: `${year}-${month}-20`, time: '08:00 PM', type: 'workspace' },
      { id: 'c4', title: 'Weekly Bookkeeping', date: `${year}-${month}-22`, time: '00:00 AM', type: 'personal' },
      { id: 'h1', title: 'CS101 Final', date: `${year}-${month}-15`, time: '10:00 AM', type: 'academic', place: 'Room 304' },
      { id: 'h2', title: 'Gym Session', date: `${year}-${month}-15`, time: '06:00 PM', type: 'lifestyle', place: 'Campus Gym' },
      { id: 'h3', title: 'Math Quiz', date: `${year}-${month}-18`, time: '02:00 PM', type: 'academic', place: 'Room 101' },
      { id: 'h4', title: 'Hobby: Painting', date: `${year}-${month}-22`, time: '08:00 PM', type: 'lifestyle', place: 'Home' },
    ];
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

  const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updated = [...calendarEvents, newEvent];
    setCalendarEvents(updated);
    localStorage.setItem('taskmate_calendar_events', JSON.stringify(updated));
  };

  const handleDeleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter(e => e.id !== id);
    setCalendarEvents(updated);
    localStorage.setItem('taskmate_calendar_events', JSON.stringify(updated));
  };

  const handleUpdateCalendarEvent = (updatedEvent: CalendarEvent) => {
    const updated = calendarEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setCalendarEvents(updated);
    localStorage.setItem('taskmate_calendar_events', JSON.stringify(updated));
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

  const handleRenameLifePage = (id: string, newName: string) => {
    const updated = lifePages.map(p => p.id === id ? { ...p, name: newName } : p);
    setLifePages(updated);
    localStorage.setItem('taskmate_life_pages', JSON.stringify(updated));
  };

  const handleChangeLifePageIcon = (id: string, newIcon: string) => {
    const updated = lifePages.map(p => p.id === id ? { ...p, icon: newIcon } : p);
    setLifePages(updated);
    localStorage.setItem('taskmate_life_pages', JSON.stringify(updated));
  };



  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <Inbox />;
      case 'calendar':
        return (
          <HybridCalendar
            events={calendarEvents}
            onAddEvent={handleAddCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            onUpdateEvent={handleUpdateCalendarEvent}
            personalColor={personalColor}
            workspaceColor={workspaceColor}
          />
        );
      case 'courses':
        return <CoursesView />;
      case 'deadlines':
        return <DeadlinesView />;

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

            />
          );
        }
        return <Dashboard
          lifePages={lifePages}
          personalTodos={personalTodos}
          onViewChange={setCurrentView}
          personalColor={personalColor}
          workspaceColor={workspaceColor}
          calendarEvents={calendarEvents}
          onUpdateCalendarEvent={handleUpdateCalendarEvent}
          onDeleteCalendarEvent={handleDeleteCalendarEvent}
        />;
    }
  };

  return (
    <div className="App" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        lifePages={lifePages}
        onAddLifePage={handleAddLifePage}
        onDeleteLifePage={handleDeleteLifePage}
        onRenameLifePage={handleRenameLifePage}
        onChangeLifePageIcon={handleChangeLifePageIcon}
        personalColor={personalColor}
        setPersonalColor={setPersonalColor}
        workspaceColor={workspaceColor}
        setWorkspaceColor={setWorkspaceColor}
      />
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
      {renderView()}
    </div>
  );
}

export default App;
