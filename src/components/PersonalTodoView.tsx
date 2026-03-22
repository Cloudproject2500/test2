import React, { useState, useEffect } from 'react';
import type { LifePage } from '../types';

interface PersonalPageViewProps {
    page: LifePage;
    content: string;
    onUpdateContent: (pageId: string, content: string) => void;
}

const PersonalPageView: React.FC<PersonalPageViewProps> = ({
    page,
    content,
    onUpdateContent,
}) => {
    const [localContent, setLocalContent] = useState(content);

    // Sync if external content changes (e.g., swapping pages)
    useEffect(() => {
        setLocalContent(content);
    }, [content, page.id]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalContent(e.target.value);
    };

    const handleBlur = () => {
        onUpdateContent(page.id, localContent);
    };

    return (
        <main className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <div className="container" style={{ maxWidth: '800px', flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '3rem' }}>{page.icon}</span>
                        {page.name}
                    </h2>
                </header>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
                    <textarea
                        value={localContent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Start typing..."
                        style={{
                            flex: 1,
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            fontSize: '1.125rem',
                            lineHeight: '1.6',
                            color: 'var(--text-primary)',
                            padding: '1rem 0',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default PersonalPageView;

