import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import StudentDashboard from './components/StudentDashboard';
import TutorialOverlay from './components/TutorialOverlay';

import Sidebar from './components/Sidebar';
import StudentInbox from './components/StudentInbox';
import HybridCalendar from './components/HybridCalendar';
import StudentCoursesView from './components/StudentCoursesView';
import StudentDeadlinesView from './components/StudentDeadlinesView';
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

function StudentApp() {

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

  const initialLifePages: LifePage[] = [];

  const [lifePages, setLifePages] = useState<LifePage[]>(() => {
    const saved = getSafeStorage('taskmate_student_pages', '');
    return saved ? JSON.parse(saved) : initialLifePages;
  });

  const [pageContents, setPageContents] = useState<Record<string, string>>(() => {
    const saved = getSafeStorage('taskmate_student_contents', '');
    return saved ? JSON.parse(saved) : {};
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = getSafeStorage('taskmate_student_events', '');
    return saved ? JSON.parse(saved) : [];
  });

  const handleUpdatePageContent = (pageId: string, content: string) => {
    const updated = { ...pageContents, [pageId]: content };
    setPageContents(updated);
    localStorage.setItem('taskmate_student_contents', JSON.stringify(updated));
  };

  const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updated = [...calendarEvents, newEvent];
    setCalendarEvents(updated);
    localStorage.setItem('taskmate_student_events', JSON.stringify(updated));
  };

  const handleDeleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter((e: CalendarEvent) => e.id !== id);
    setCalendarEvents(updated);
    localStorage.setItem('taskmate_student_events', JSON.stringify(updated));
  };

  const handleUpdateCalendarEvent = (updatedEvent: CalendarEvent) => {
    const updated = calendarEvents.map((e: CalendarEvent) => e.id === updatedEvent.id ? updatedEvent : e);
    setCalendarEvents(updated);
    localStorage.setItem('taskmate_student_events', JSON.stringify(updated));
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
    localStorage.setItem('taskmate_student_pages', JSON.stringify(updated));
  };

  const handleDeleteLifePage = (id: string) => {
    const updated = lifePages.filter((p: LifePage) => p.id !== id);
    setLifePages(updated);
    localStorage.setItem('taskmate_student_pages', JSON.stringify(updated));
    if (currentView === id) setCurrentView('dashboard');
  };

  const handleRenameLifePage = (id: string, newName: string) => {
    const updated = lifePages.map((p: LifePage) => p.id === id ? { ...p, name: newName } : p);
    setLifePages(updated);
    localStorage.setItem('taskmate_student_pages', JSON.stringify(updated));
  };

  const handleChangeLifePageIcon = (id: string, newIcon: string) => {
    const updated = lifePages.map((p: LifePage) => p.id === id ? { ...p, icon: newIcon } : p);
    setLifePages(updated);
    localStorage.setItem('taskmate_student_pages', JSON.stringify(updated));
  };



  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <StudentInbox />;
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
        return <StudentCoursesView />;
      case 'deadlines':
        return <StudentDeadlinesView />;
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
        const matchedPage = lifePages.find((p: LifePage) => p.id === currentView);
        if (matchedPage) {
          return (
            <PersonalPageView
              page={matchedPage}
              content={pageContents[matchedPage.id] || ''}
              onUpdateContent={handleUpdatePageContent}
            />
          );
        }
        return <StudentDashboard
          lifePages={lifePages}
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
    <div className="StudentApp" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
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
        inboxBadgeCount={0}
      />
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
      {renderView()}
    </div>
  );
}

export default StudentApp;
