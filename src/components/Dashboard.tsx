import React from 'react';
import type { LifePage, PersonalTodo, CalendarEvent } from '../types';

interface DashboardProps {
    lifePages: LifePage[];
    personalTodos: PersonalTodo[];
    onViewChange: (view: string) => void;
    personalColor: string;
    workspaceColor: string;
    calendarEvents: CalendarEvent[];
    onUpdateCalendarEvent: (event: CalendarEvent) => void;
    onDeleteCalendarEvent: (id: string) => void;
}

const ImageWidget: React.FC = () => {
    const [image, setImage] = React.useState<string | null>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 50, y: 50 });
    const [scale, setScale] = React.useState(1);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Modal Drag State
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const [tempPosition, setTempPosition] = React.useState({ x: 50, y: 50 });
    const [tempScale, setTempScale] = React.useState(1);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const openModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTempPosition(position); // Reset temp to current saved
        setTempScale(scale);
        setIsEditing(true);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = dragStart.x - e.clientX;
        const deltaY = dragStart.y - e.clientY;

        setTempPosition(prev => ({
            x: Math.max(0, Math.min(100, prev.x + (deltaX * 0.15))),
            y: Math.max(0, Math.min(100, prev.y + (deltaY * 0.15)))
        }));

        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    const saveAndCloseModal = () => {
        setPosition(tempPosition);
        setScale(tempScale);
        setIsEditing(false);
    };

    return (
        <>
            {/* The Dashboard Widget Block */}
            <div
                className="premium-card"
                style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: image ? 'none' : '1px dashed #cbd5e1',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: 'var(--bg-card)',
                    padding: image ? 0 : '1.5rem',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: 0
                }}
                onClick={() => { if (!image) fileInputRef.current?.click(); }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {image ? (
                    <>
                        <img
                            src={image}
                            alt="Widget"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: `${position.x}% ${position.y}%`,
                                transform: `scale(${scale})`,
                                pointerEvents: 'none',
                                transition: 'transform 0.2s ease',
                                transformOrigin: `${position.x}% ${position.y}%`
                            }}
                        />

                        {/* Hover Edit Pencil Icon */}
                        {isHovered && (
                            <>
                                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImage(null);
                                            setPosition({ x: 50, y: 50 });
                                            setScale(1);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        style={{
                                            background: 'var(--bg-card)',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}
                                        title="Delete Image"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    <button
                                        onClick={openModal}
                                        style={{
                                            background: 'var(--bg-card)',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}
                                        title="Reposition Image"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <span style={{ color: '#94a3b8', fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>+</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>Add image or GIF</span>
                    </>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
            </div>

            {/* Reposition Modal Overlay */}
            {isEditing && image && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.85)', zIndex: 99999,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <div style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
                        Drag image to reposition
                    </div>

                    {/* The Visual Cropper Window */}
                    <div
                        style={{
                            width: '400px', height: '300px', // Approximate widget aspect ratio
                            border: '2px solid white',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)', // Darkens everything OUTSIDE this box
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <img
                            src={image}
                            alt="Crop preview"
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                objectPosition: `${tempPosition.x}% ${tempPosition.y}%`,
                                transform: `scale(${tempScale})`,
                                transition: 'transform 0.2s ease',
                                transformOrigin: `${tempPosition.x}% ${tempPosition.y}%`,
                                pointerEvents: 'none'
                            }}
                        />
                    </div>

                    {/* Zoom Controls */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', zIndex: 100000, position: 'relative', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                        <button
                            onClick={() => setTempScale(s => Math.max(1, s - 0.1))}
                            style={{ background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.25rem' }}
                            title="Zoom Out"
                        >
                            -
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', width: '60px', fontFamily: 'monospace' }}>
                            {Math.round(tempScale * 100)}%
                        </div>
                        <button
                            onClick={() => setTempScale(s => Math.min(3, s + 0.1))}
                            style={{ background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.25rem' }}
                            title="Zoom In"
                        >
                            +
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', zIndex: 100000, position: 'relative' }}>
                        <button
                            onClick={saveAndCloseModal}
                            style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                opacity: 1,
                                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            Save Position
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{
                                background: '#1e293b',
                                color: 'white',
                                border: '1px solid #94a3b8',
                                borderRadius: '8px',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                opacity: 1
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ 
    onViewChange, 
    personalColor, 
    workspaceColor, 
    calendarEvents,
    onUpdateCalendarEvent,
    onDeleteCalendarEvent 
}) => {

    const [greeting, setGreeting] = React.useState('');
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // Editable inline text helper
    const EditableText = ({ value, onChange, style, placeholder }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties; placeholder?: string }) => {
        const [isEditing, setIsEditing] = React.useState(false);
        const [draft, setDraft] = React.useState(value);

        if (isEditing) {
            return (
                <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => { onChange(draft); setIsEditing(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { onChange(draft); setIsEditing(false); } if (e.key === 'Escape') { setDraft(value); setIsEditing(false); } }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={placeholder || 'Type here...'}
                    style={{
                        ...style,
                        border: '1px solid var(--accent-blue, #3b82f6)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        outline: 'none',
                        width: '100%',
                        background: 'var(--bg-card, #fff)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit'
                    }}
                />
            );
        }

        return (
            <span
                style={{ cursor: 'text', minWidth: '80px', minHeight: '1.2em', display: 'inline-block', ...style }}
                onClick={(e) => { e.stopPropagation(); setDraft(value); setIsEditing(true); }}
                title="Click to edit"
            >
                {value || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>{placeholder || 'Click to type...'}</span>}
            </span>
        );
    };

    // Editable Date picker helper
    const EditableDate = ({ value, onChange, style }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties }) => {
        const [isEditing, setIsEditing] = React.useState(false);
        const [draft, setDraft] = React.useState(value);

        // Helper to format date string into readable format (e.g., Mar 20)
        const formatDisplayDate = (dateStr: string) => {
            if (!dateStr) return 'Select date';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
        };

        if (isEditing) {
            return (
                <input
                    autoFocus
                    type="date"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => { onChange(draft); setIsEditing(false); }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') { onChange(draft); setIsEditing(false); }
                        if (e.key === 'Escape') { setDraft(value); setIsEditing(false); }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        ...style,
                        border: '1px solid var(--accent-blue, #3b82f6)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        outline: 'none',
                        background: 'var(--bg-card, #fff)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit'
                    }}
                />
            );
        }

        return (
            <span
                style={{ cursor: 'pointer', ...style }}
                onClick={(e) => { e.stopPropagation(); setDraft(value); setIsEditing(true); }}
                title="Click to select date"
            >
                {formatDisplayDate(value)}
            </span>
        );
    };

    // Delete button style helper
    const deleteBtn = (onClick: (e: React.MouseEvent) => void) => (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#cbd5e1',
                fontSize: '1rem',
                padding: '2px 4px',
                lineHeight: 1,
                flexShrink: 0,
                marginLeft: '8px',
                transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
            title="Delete"
        >
            ✕
        </button>
    );

    // Interactive Tasks State
    const [todayTasks, setTodayTasks] = React.useState([
        { title: 'Review CS 301 lecture notes', checked: false },
        { title: 'Submit MATH 245 problem set', checked: true },
        { title: 'Read Chapter 7 — Mechanics', checked: false },
        { title: 'Office hours with Dr. Lin', checked: false }
    ]);

    const toggleTask = (index: number) => {
        setTodayTasks(prev => prev.map((t, i) => i === index ? { ...t, checked: !t.checked } : t));
    };

    const updateTaskTitle = (index: number, newTitle: string) => {
        setTodayTasks(prev => prev.map((t, i) => i === index ? { ...t, title: newTitle } : t));
    };

    const deleteTask = (index: number) => {
        setTodayTasks(prev => prev.filter((_, i) => i !== index));
    };

    // Schedule State
    const [scheduleEvents, setScheduleEvents] = React.useState([
        { title: 'PHYS 201 Lecture', time: '9:00 AM', color: '#f59e0b' },
        { title: 'Office Hours', time: '10:30 AM', color: '#94a3b8' },
        { title: 'CS 301 Lab', time: '1:00 PM', color: '#3b82f6' },
        { title: 'Study Group', time: '3:00 PM', color: '#14b8a6' }
    ]);

    const updateScheduleTitle = (index: number, newTitle: string) => {
        setScheduleEvents(prev => prev.map((e, i) => i === index ? { ...e, title: newTitle } : e));
    };

    const deleteScheduleEvent = (index: number) => {
        setScheduleEvents(prev => prev.filter((_, i) => i !== index));
    };

    // Upcoming Events State
    const [upcomingEvents, setUpcomingEvents] = React.useState([
        { title: 'Midterm Exam — CS 301', date: '2026-03-20' },
        { title: 'Group Presentation', date: '2026-03-22' },
        { title: 'Career Fair', date: '2026-03-25' }
    ]);

    const updateUpcomingEvent = (index: number, field: 'title' | 'date', value: string) => {
        setUpcomingEvents(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
    };

    const deleteUpcomingEvent = (index: number) => {
        setUpcomingEvents(prev => prev.filter((_, i) => i !== index));
    };

    // Reminders State
    const [reminders, setReminders] = React.useState([
        { title: 'Return library books', color: '#ef4444' },
        { title: 'Register for summer courses', color: '#cbd5e1' },
        { title: 'Email Prof. Adams about draft', color: '#cbd5e1' }
    ]);

    const updateReminderTitle = (index: number, newTitle: string) => {
        setReminders(prev => prev.map((r, i) => i === index ? { ...r, title: newTitle } : r));
    };

    const deleteReminder = (index: number) => {
        setReminders(prev => prev.filter((_, i) => i !== index));
    };

    const updateCalendarEvent = (id: string, field: keyof CalendarEvent, value: string) => {
        const event = calendarEvents.find(e => e.id === id);
        if (event) {
            onUpdateCalendarEvent({ ...event, [field]: value });
        }
    };

    const deleteCalendarEvent = (id: string) => {
        onDeleteCalendarEvent(id);
    };

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning, Kevin');
        else if (hour < 18) setGreeting('Good afternoon, Kevin');
        else setGreeting('Good evening, Kevin');
    }, []);

    // Calendar Calculations
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 28, 29, 30, or 31

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthYearString = `${monthNames[currentMonth]} ${currentYear}`;

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Real-time Chart Data Calculation
    const getWeeklyEventCounts = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        // Set to Monday of the current week
        const day = now.getDay();
        const diff = now.getDate() - (day === 0 ? 6 : day - 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const counts = [0, 0, 0, 0, 0, 0, 0]; // M, T, W, Th, F, S, Su
        calendarEvents.forEach(event => {
            // event.date is in YYYY-MM-DD format
            const [y, m, d] = event.date.split('-').map(Number);
            const eventDate = new Date(y, m - 1, d); // Parse as local date
            
            if (eventDate >= startOfWeek && eventDate < endOfWeek) {
                const eventDay = (eventDate.getDay() === 0 ? 6 : eventDate.getDay() - 1);
                counts[eventDay]++;
            }
        });
        return counts;
    };

    const thisWeekEventCounts = getWeeklyEventCounts();
    const maxEventsInWeek = Math.max(...thisWeekEventCounts, 1);
    const todayIndex = (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

    // Pie Chart distribution
    const calculateDistribution = () => {
        const counts = {
            personal: calendarEvents.filter(e => e.type === 'personal').length,
            workspace: calendarEvents.filter(e => e.type === 'workspace').length,
            academic: calendarEvents.filter(e => e.type === 'academic').length,
            lifestyle: calendarEvents.filter(e => e.type === 'lifestyle').length,
        };
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        if (total === 0) return null;

        const p = (counts.personal / total) * 100;
        const w = (counts.workspace / total) * 100;
        const a = (counts.academic / total) * 100;
        const l = (counts.lifestyle / total) * 100;

        return {
            gradient: `conic-gradient(
                ${personalColor} 0% ${p}%,
                ${workspaceColor} ${p}% ${p + w}%,
                var(--accent-blue) ${p + w}% ${p + w + a}%,
                var(--success) ${p + w + a}% 100%
            )`,
            total,
            counts,
            percentages: { p, w, a, l }
        };
    };

    const distribution = calculateDistribution();
    const totalEvents = calendarEvents.length;
    const brandBlue = '#3b82f6';

    return (
        <main className="main-wrapper" style={{ padding: '2rem 1rem' }}>
            <div className="container">

                {/* DYNAMIC HEADER */}
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: brandBlue }}>
                        {greeting}
                    </h1>
                </header>

                {/* TOP GRID SECTION */}
                <section className="dashboard-top-section">
                    <div className="dashboard-2x2-grid">

                        {/* Box 1: Today's Task */}
                        <div className="mini-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', borderRadius: '16px' }} onClick={() => onViewChange('work')}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Task</h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, overflowY: 'auto' }}>
                                {todayTasks.map((task, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleTask(i);
                                            }}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '6px',
                                                border: task.checked ? 'none' : '2px solid #cbd5e1',
                                                background: task.checked ? '#3b82f6' : 'transparent',
                                                marginRight: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                flexShrink: 0
                                            }}
                                        >
                                            {task.checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                        </div>
                                        <EditableText
                                            value={task.title}
                                            onChange={(v) => updateTaskTitle(i, v)}
                                            style={{
                                                fontSize: '0.9375rem',
                                                fontWeight: 600,
                                                color: task.checked ? '#cbd5e1' : 'var(--text-primary)',
                                                textDecoration: task.checked ? 'line-through' : 'none',
                                                flex: 1,
                                                transition: 'color 0.15s ease'
                                            }}
                                        />
                                        {deleteBtn((e) => { e.stopPropagation(); deleteTask(i); })}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Box 2: Today's Schedule */}
                        <div className="mini-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', borderRadius: '16px' }} onClick={() => onViewChange('calendar')}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Schedule</h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, overflowY: 'auto' }}>
                                {scheduleEvents.map((event, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.color, marginRight: '16px', flexShrink: 0 }}></div>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', width: '70px', flexShrink: 0 }}>{event.time}</span>
                                        <EditableText
                                            value={event.title}
                                            onChange={(v) => updateScheduleTitle(i, v)}
                                            style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}
                                        />
                                        {deleteBtn((e) => { e.stopPropagation(); deleteScheduleEvent(i); })}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Box 3: Upcoming Events */}
                        <div className="mini-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', borderRadius: '16px' }} onClick={() => onViewChange('calendar')}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                marginBottom: '1.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: workspaceColor, flexShrink: 0 }}></div>
                                Upcoming Events
                            </h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, overflowY: 'auto' }}>
                                {upcomingEvents.map((event, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <EditableText
                                            value={event.title}
                                            onChange={(v) => updateUpcomingEvent(i, 'title', v)}
                                            style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: '8px' }}>
                                            <EditableDate
                                                value={event.date}
                                                onChange={(v) => updateUpcomingEvent(i, 'date', v)}
                                                style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8' }}
                                            />
                                            {deleteBtn((e) => { e.stopPropagation(); deleteUpcomingEvent(i); })}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Box 4: Reminders */}
                        <div className="mini-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', borderRadius: '16px' }} onClick={() => onViewChange('personal')}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reminders</h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, overflowY: 'auto' }}>
                                {reminders.map((reminder, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: reminder.color, marginRight: '16px', flexShrink: 0 }}></div>
                                        <EditableText
                                            value={reminder.title}
                                            onChange={(v) => updateReminderTitle(i, v)}
                                            style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}
                                        />
                                        {deleteBtn((e) => { e.stopPropagation(); deleteReminder(i); })}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* WIDGET/IMAGE COLUMN */}
                    <div className="dashboard-widget-column">
                        <ImageWidget />
                        <ImageWidget />
                    </div>
                </section>

                <div className="section-divider"></div>

                {/* PROGRESS SECTION */}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Progress</h2>
                <section className="dashboard-progress-section">
                    <div className="premium-card flex-center">
                        <div className="pie-chart" style={{ background: distribution?.gradient || 'var(--bg-card)' }}>
                            <div className="pie-chart-inner">
                                <div>
                                    <span style={{ display: 'block', fontWeight: 700, color: 'var(--text-primary)' }}>{totalEvents}</span>
                                    <span>Total Events</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600 }}>Weekly Event Flow</h3>
                        <div className="bar-chart-container" style={{ flex: 1, padding: '0 1rem' }}>
                            {['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].map((day, i) => {
                                const isToday = i === todayIndex;
                                return (
                                    <div key={day} className="bar-column">
                                        <div style={{ 
                                            flex: 1, 
                                            width: '36px', 
                                            background: isToday ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-hover)', 
                                            border: isToday ? `1.5px solid ${workspaceColor}` : 'none',
                                            borderRadius: '8px', 
                                            position: 'relative', 
                                            overflow: 'hidden',
                                            boxShadow: isToday ? `0 0 15px ${workspaceColor}22` : 'none'
                                        }}>
                                            {thisWeekEventCounts[i] > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '0',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    color: isToday ? workspaceColor : 'var(--text-secondary)',
                                                    zIndex: 2,
                                                    pointerEvents: 'none'
                                                }}>
                                                    {thisWeekEventCounts[i]}
                                                </div>
                                            )}
                                            <div 
                                                className="bar-fill" 
                                                style={{ 
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: `${(thisWeekEventCounts[i] / maxEventsInWeek) * 100}%`,
                                                    background: isToday 
                                                        ? `linear-gradient(180deg, ${workspaceColor}, ${personalColor})`
                                                        : `linear-gradient(180deg, ${personalColor}, ${workspaceColor})`,
                                                    borderRadius: '8px 8px 0 0',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    transition: 'height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                                }}
                                            ></div>
                                        </div>
                                        <span className="bar-label" style={{ 
                                            fontWeight: isToday ? 800 : 600, 
                                            color: isToday ? workspaceColor : 'var(--text-secondary)', 
                                            fontSize: '0.75rem', 
                                            marginTop: '0.5rem',
                                            transform: isToday ? 'scale(1.1)' : 'none',
                                            transition: 'transform 0.3s ease'
                                        }}>{day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="section-divider"></div>

                {/* EVENTS SECTION */}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Events</h2>
                <section className="dashboard-events-section">
                    <div className="premium-card" style={{ padding: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{monthYearString}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>&lt;</button>
                                <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>&gt;</button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)', padding: '1px' }}>
                            {/* Days Header */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} style={{ background: 'var(--bg-card)', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {d}
                                </div>
                            ))}
                            {/* Blank leading days */}
                            {[...Array(firstDayOfMonth)].map((_, i) => (
                                <div key={`empty-${i}`} style={{ background: 'var(--bg-card)', height: '100px', opacity: 0.5 }}></div>
                            ))}
                            {/* Days of month */}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const realToday = new Date();
                                const isToday =
                                    day === realToday.getDate() &&
                                    currentMonth === realToday.getMonth() &&
                                    currentYear === realToday.getFullYear();

                                return (
                                    <div key={day} style={{
                                        background: 'var(--bg-card)',
                                        height: '100px',
                                        padding: '0.5rem',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: isToday ? 'var(--accent-blue)' : 'transparent',
                                            color: isToday ? 'white' : 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            fontWeight: isToday ? 600 : 400,
                                            marginBottom: '4px'
                                        }}>
                                            {day}
                                        </span>
                                        <div className="thin-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
                                            {calendarEvents
                                                .filter(e => {
                                                    const eDate = new Date(e.date);
                                                    return eDate.getDate() === day && eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
                                                })
                                                .map((event) => {
                                                    const isPersonal = event.type === 'personal';
                                                    const bgColor = isPersonal ? personalColor : workspaceColor;
                                                    return (
                                                        <div
                                                            key={event.id}
                                                            style={{
                                                                background: bgColor,
                                                                color: 'white',
                                                                fontSize: '0.7rem',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                fontWeight: 500,
                                                                width: '100%',
                                                                display: 'block'
                                                            }}
                                                            title={event.title}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="dashboard-widget-column thin-scrollbar" style={{ overflowY: 'auto', maxHeight: '650px', paddingRight: '12px' }}>
                        {calendarEvents.map((event) => {
                            const isPersonal = event.type === 'personal';
                            const indicatorColor = isPersonal ? personalColor : workspaceColor;

                            return (
                                <div
                                    key={event.id}
                                    className="mini-card"
                                    style={{
                                        minHeight: '80px',
                                        flex: 'none',
                                        position: 'relative',
                                        marginBottom: '12px',
                                        borderLeft: `4px solid ${indicatorColor}`,
                                        paddingLeft: '12px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <EditableText
                                                value={event.title}
                                                onChange={(v) => updateCalendarEvent(event.id, 'title', v)}
                                                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <EditableDate
                                                    value={event.date}
                                                    onChange={(v) => updateCalendarEvent(event.id, 'date', v)}
                                                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                                                />
                                                <EditableText
                                                    value={event.time}
                                                    onChange={(v) => updateCalendarEvent(event.id, 'time', v)}
                                                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                                                />
                                            </div>
                                        </div>
                                        {deleteBtn((e) => { e.stopPropagation(); deleteCalendarEvent(event.id); })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <footer style={{ marginTop: '4rem', paddingBottom: '2rem', opacity: 0.6, fontSize: '0.8125rem' }}>
                    <p>© 2026 TaskMate OS Architect. Management Platform v2.0.0</p>
                </footer>
            </div>
        </main>
    );
};

export default Dashboard;
