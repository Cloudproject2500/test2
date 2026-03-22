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
import Settings from './components/Settings';
import type { LifePage, PersonalTodo, CalendarEvent } from './types';

// Safety helper for localStorage
const getSafeStorage = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    console.warn('LocalStorage access failed:', e);
    return fallback;
  }
};

function App() {

  const [currentView, setCurrentView] = useState('dashboard');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [theme] = useState(() => getSafeStorage('taskmate_theme', 'glass'));

  const [isDarkMode, setIsDarkMode] = useState(() => getSafeStorage('taskmate_dark_mode', 'false') === 'true');

  const [customFontColor, setCustomFontColor] = useState(() => getSafeStorage('taskmate_font_color', '#37352f'));

  const [personalColor, setPersonalColor] = useState(() => getSafeStorage('taskmate_personal_color', '#22c55e'));
  const [workspaceColor, setWorkspaceColor] = useState(() => getSafeStorage('taskmate_workspace_color', '#3b82f6'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('taskmate_theme', theme);
    } catch (e) {
      console.warn('LocalStorage setItem failed:', e);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', isDarkMode ? 'dark' : 'light');
    try {
      localStorage.setItem('taskmate_dark_mode', String(isDarkMode));
    } catch (e) {
      console.warn('LocalStorage setItem failed:', e);
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--user-font-color', customFontColor);
    try {
      localStorage.setItem('taskmate_font_color', customFontColor);
    } catch (e) {
      console.warn('LocalStorage setItem failed:', e);
    }
  }, [customFontColor]);

  const initialLifePages: LifePage[] = [
    { id: 'lifestyle', name: 'Lifestyle', icon: '☘️', type: 'default' },
    { id: 'fitness', name: 'Fitness', icon: '💪', type: 'default' },
    { id: 'hobbies', name: 'Hobbies', icon: '🎨', type: 'default' }
  ];

  const [lifePages, setLifePages] = useState<LifePage[]>([]);
  const [personalTodos, setPersonalTodos] = useState<PersonalTodo[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: profile } = await supabase
            .from('profiles')
            .select('has_seen_tutorial, role')
            .eq('user_id', user.id)
            .single();
            
          if (profile) {
            setUserRole(profile.role);
            if (profile.has_seen_tutorial === false) {
              setShowTutorial(true);
            }

            // LOAD DATA FOR LOGGED IN USER
            if (profile.role === 'student' || profile.role === 'instructor') {
              // For real users, we start with an empty slate. 
              // Eventually, this will fetch directly from the Supabase database.
              // For now, we'll check localStorage using a user-specific key so they don't overwrite demo data.
              const savedPages = getSafeStorage(`taskmate_pages_${user.id}`, '');
              setLifePages(savedPages ? JSON.parse(savedPages) : []);

              const savedTodos = getSafeStorage(`taskmate_todos_${user.id}`, '');
              setPersonalTodos(savedTodos ? JSON.parse(savedTodos) : []);

              const savedEvents = getSafeStorage(`taskmate_events_${user.id}`, '');
              setCalendarEvents(savedEvents ? JSON.parse(savedEvents) : []);
            }
          }
        } else {
          // NOT LOGGED IN - LOAD DEMO DATA
          setUserRole('demo');
          const savedPages = getSafeStorage('taskmate_demo_life_pages', '');
          setLifePages(savedPages ? JSON.parse(savedPages) : initialLifePages);

          const savedTodos = getSafeStorage('taskmate_demo_todos', '');
          setPersonalTodos(savedTodos ? JSON.parse(savedTodos) : []);

          const savedEvents = getSafeStorage('taskmate_demo_events', '');
          if (savedEvents) {
            setCalendarEvents(JSON.parse(savedEvents));
          } else {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            setCalendarEvents([
              { id: 'c1', title: 'TEK Club meeting', date: `${year}-${month}-18`, time: '12:00 PM', type: 'personal' },
              { id: 'c2', title: 'Business Night', date: `${year}-${month}-18`, time: '06:30 PM', type: 'workspace' },
              { id: 'c3', title: 'STUCO Team dinner', date: `${year}-${month}-20`, time: '08:00 PM', type: 'workspace' },
              { id: 'c4', title: 'Weekly Bookkeeping', date: `${year}-${month}-22`, time: '00:00 AM', type: 'personal' },
              { id: 'h1', title: 'CS101 Final', date: `${year}-${month}-15`, time: '10:00 AM', type: 'academic', place: 'Room 304' },
              { id: 'h2', title: 'Gym Session', date: `${year}-${month}-15`, time: '06:00 PM', type: 'lifestyle', place: 'Campus Gym' },
              { id: 'h3', title: 'Math Quiz', date: `${year}-${month}-18`, time: '02:00 PM', type: 'academic', place: 'Room 101' },
              { id: 'h4', title: 'Hobby: Painting', date: `${year}-${month}-22`, time: '08:00 PM', type: 'lifestyle', place: 'Home' },
            ]);
          }
        }
      } catch (err) {
        console.warn('App init failed:', err);
      } finally {
        setIsAppLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleCloseTutorial = async () => {
    setShowTutorial(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ has_seen_tutorial: true }).eq('user_id', user.id);
    }
  };

  const getStorageKeyPrefix = () => {
    return currentUserId ? `taskmate_` : `taskmate_demo_`;
  };

  const getStorageKeySuffix = () => {
    return currentUserId ? `_${currentUserId}` : ``;
  };

  const saveTodos = (updated: PersonalTodo[]) => {
    setPersonalTodos(updated);
    if (currentUserId) {
      localStorage.setItem(`taskmate_todos_${currentUserId}`, JSON.stringify(updated));
    } else {
      localStorage.setItem('taskmate_demo_todos', JSON.stringify(updated));
    }
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
    localStorage.setItem(`${getStorageKeyPrefix()}events${getStorageKeySuffix()}`, JSON.stringify(updated));
  };

  const handleDeleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter(e => e.id !== id);
    setCalendarEvents(updated);
    localStorage.setItem(`${getStorageKeyPrefix()}events${getStorageKeySuffix()}`, JSON.stringify(updated));
  };

  const handleUpdateCalendarEvent = (updatedEvent: CalendarEvent) => {
    const updated = calendarEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setCalendarEvents(updated);
    localStorage.setItem(`${getStorageKeyPrefix()}events${getStorageKeySuffix()}`, JSON.stringify(updated));
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
    localStorage.setItem(`${getStorageKeyPrefix()}life_pages${getStorageKeySuffix()}`, JSON.stringify(updated));
  };

  const handleDeleteLifePage = (id: string) => {
    const updated = lifePages.filter(p => p.id !== id);
    setLifePages(updated);
    localStorage.setItem(`${getStorageKeyPrefix()}life_pages${getStorageKeySuffix()}`, JSON.stringify(updated));
    if (currentView === id) setCurrentView('dashboard');
  };

  const handleRenameLifePage = (id: string, newName: string) => {
    const updated = lifePages.map(p => p.id === id ? { ...p, name: newName } : p);
    setLifePages(updated);
    localStorage.setItem(`${getStorageKeyPrefix()}life_pages${getStorageKeySuffix()}`, JSON.stringify(updated));
  };

  const handleChangeLifePageIcon = (id: string, newIcon: string) => {
    const updated = lifePages.map(p => p.id === id ? { ...p, icon: newIcon } : p);
    setLifePages(updated);
    localStorage.setItem(`${getStorageKeyPrefix()}life_pages${getStorageKeySuffix()}`, JSON.stringify(updated));
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
      case 'settings':
        return (
          <Settings 
            isDarkMode={isDarkMode}
            onDarkModeToggle={setIsDarkMode}
            customFontColor={customFontColor}
            onFontColorChange={setCustomFontColor}
          />
        );

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

  if (isAppLoading) {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)' }}>
        <style>
          {`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .loader { border: 3px solid var(--border-color); border-top: 3px solid var(--accent-blue); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
          `}
        </style>
        <div className="loader"></div>
      </div>
    );
  }

  // Very basic condition to render Instructor vs Student vs Demo UI entirely
  // Feel free to replace this empty instruction text with actual instructor components later.
  if (userRole === 'instructor') {
    return (
      <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-primary)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
        <h2>Instructor Dashboard</h2>
        <p>This is where the instructor layout will be built.</p>
        <button className="btn-primary" onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}>Sign Out</button>
      </div>
    );
  }

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
