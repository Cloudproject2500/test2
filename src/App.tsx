import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import TutorialOverlay from './components/TutorialOverlay';

import Sidebar from './components/Sidebar';
import Inbox from './components/Inbox';
import HybridCalendar from './components/HybridCalendar';
import CoursesView from './components/CoursesView';
import DeadlinesView from './components/DeadlinesView';
import PersonalPageView from './components/PersonalTodoView';
import Settings from './components/Settings';
import type { LifePage, CalendarEvent } from './types';

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

  const handleDarkModeToggle = (newIsDark: boolean) => {
    setIsDarkMode(newIsDark);
    
    // Smart font color swap for readability
    if (newIsDark) {
      // If switching to dark mode and font is currently black/dark
      if (customFontColor.toLowerCase() === '#37352f' || customFontColor.toLowerCase() === '#000000' || customFontColor.toLowerCase() === '#1e293b') {
        setCustomFontColor('#ffffff');
      }
    } else {
      // If switching to light mode and font is currently white
      if (customFontColor.toLowerCase() === '#ffffff') {
        setCustomFontColor('#37352f');
      }
    }
  };

  useEffect(() => {
    const checkTutorial = async () => {
      try {
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
      } catch (err) {
        console.warn('Auth check skipped or failed:', err);
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
    { id: 'fitness', name: 'Fitness', icon: '💪', type: 'default' },
    { id: 'hobbies', name: 'Hobbies', icon: '🎨', type: 'default' }
  ];

  const [lifePages, setLifePages] = useState<LifePage[]>(() => {
    const saved = getSafeStorage('taskmate_life_pages', '');
    return saved ? JSON.parse(saved) : initialLifePages;
  });

  const [workspacePages, setWorkspacePages] = useState<LifePage[]>(() => {
    const saved = getSafeStorage('taskmate_workspace_pages', '');
    return saved ? JSON.parse(saved) : [];
  });

  const [pageContents, setPageContents] = useState<Record<string, string>>(() => {
    const saved = getSafeStorage('taskmate_page_contents', '');
    return saved ? JSON.parse(saved) : {};
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = getSafeStorage('taskmate_calendar_events', '');
    if (saved) return JSON.parse(saved);

    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    return [
      { id: 'c1', title: 'TEK Club meeting', date: `${year}-${month}-18`, time: '12:00 PM', type: 'personal' },
      { id: 'c2', title: 'Business Night', date: `${year}-${month}-18`, time: '06:30 PM', type: 'workspace' },
      { id: 'c3', title: 'STUCO Team dinner', date: `${year}-${month}-20`, time: '08:00 PM', type: 'workspace' },
      { id: 'c4', title: 'Weekly Bookkeeping', date: `${year}-${month}-22`, time: '00:00 AM', type: 'personal' },
      { id: 'h1', title: 'CS101 Final', date: `${year}-${month}-15`, time: '10:00 AM', type: 'academic', place: 'Room 304' },
      { id: 'h2', title: 'Gym Session', date: `${year}-${month}-15`, time: '06:00 PM', type: 'personal', place: 'Campus Gym' },
      { id: 'h3', title: 'Math Quiz', date: `${year}-${month}-18`, time: '02:00 PM', type: 'academic', place: 'Room 101' },
      { id: 'h4', title: 'Hobby: Painting', date: `${year}-${month}-22`, time: '08:00 PM', type: 'personal', place: 'Home' },
    ];
  });

  const handleUpdatePageContent = (pageId: string, content: string) => {
    const updated = { ...pageContents, [pageId]: content };
    setPageContents(updated);
    localStorage.setItem('taskmate_page_contents', JSON.stringify(updated));
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

  const handleUpdatePage = (id: string, updates: Partial<LifePage>) => {
    const isLifePage = lifePages.some(p => p.id === id);
    if (isLifePage) {
      const updated = lifePages.map(p => p.id === id ? { ...p, ...updates } : p);
      setLifePages(updated);
      localStorage.setItem('taskmate_life_pages', JSON.stringify(updated));
    } else {
      const updated = workspacePages.map(p => p.id === id ? { ...p, ...updates } : p);
      setWorkspacePages(updated);
      localStorage.setItem('taskmate_workspace_pages', JSON.stringify(updated));
    }
  };

  const handleAddWorkspacePage = (name: string) => {
    const newPage: LifePage = {
      id: `ws-${Date.now()}`,
      name: name || 'Untitled',
      icon: '📄',
      type: 'custom'
    };
    const updated = [...workspacePages, newPage];
    setWorkspacePages(updated);
    localStorage.setItem('taskmate_workspace_pages', JSON.stringify(updated));
    setCurrentView(newPage.id);
  };

  const handleDeleteWorkspacePage = (id: string) => {
    const updated = workspacePages.filter(p => p.id !== id);
    setWorkspacePages(updated);
    localStorage.setItem('taskmate_workspace_pages', JSON.stringify(updated));
    if (currentView === id) setCurrentView('dashboard');
  };

  const handleRenameWorkspacePage = (id: string, newName: string) => {
    const updated = workspacePages.map(p => p.id === id ? { ...p, name: newName } : p);
    setWorkspacePages(updated);
    localStorage.setItem('taskmate_workspace_pages', JSON.stringify(updated));
  };

  const handleChangeWorkspacePageIcon = (id: string, newIcon: string) => {
    const updated = workspacePages.map(p => p.id === id ? { ...p, icon: newIcon } : p);
    setWorkspacePages(updated);
    localStorage.setItem('taskmate_workspace_pages', JSON.stringify(updated));
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
            onDarkModeToggle={handleDarkModeToggle}
            customFontColor={customFontColor}
            onFontColorChange={setCustomFontColor}
          />
        );

      default:
        const matchedPage = [...lifePages, ...workspacePages].find((p: LifePage) => p.id === currentView);
        if (matchedPage) {
          return (
            <PersonalPageView
              page={matchedPage}
              content={pageContents[matchedPage.id] || ''}
              onUpdateContent={handleUpdatePageContent}
              onUpdatePage={handleUpdatePage}
            />
          );
        }
        return <Dashboard
          lifePages={lifePages}
          workspacePages={workspacePages}
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
    <div className="app-container" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        lifePages={lifePages}
        onAddLifePage={handleAddLifePage}
        onDeleteLifePage={handleDeleteLifePage}
        onRenameLifePage={handleRenameLifePage}
        onChangeLifePageIcon={handleChangeLifePageIcon}
        workspacePages={workspacePages}
        onAddWorkspacePage={handleAddWorkspacePage}
        onDeleteWorkspacePage={handleDeleteWorkspacePage}
        onRenameWorkspacePage={handleRenameWorkspacePage}
        onChangeWorkspacePageIcon={handleChangeWorkspacePageIcon}
        personalColor={personalColor}
        setPersonalColor={setPersonalColor}
        workspaceColor={workspaceColor}
        setWorkspaceColor={setWorkspaceColor}
        inboxBadgeCount={3}
      />
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
      {renderView()}
    </div>
  );
}

export default App;
