import React, { useState } from 'react';
import type { Course } from '../types';

interface CourseCardProps {
    course: Course;

}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getAttributeBadge = (attr: string) => {
        const colors: Record<string, string> = {
            'QI': '#3B82F6', // Blue
            'CW': '#10B981', // Emerald
            'FF': '#F59E0B', // Amber
        };
        return (
            <span key={attr} style={{
                backgroundColor: colors[attr] || '#9CA3AF',
                color: 'white',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '4px',
                fontWeight: 600
            }}>
                {attr}
            </span>
        );
    };

    return (
        <div className="course-card" style={{
            backgroundColor: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
        }}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {course.code} - {course.name}
                        {course.attributes.map(getAttributeBadge)}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {course.instructor} • {course.days.join(', ')} {course.startTime} - {course.endTime}
                    </p>
                </div>

            </div>

            {isExpanded && (
                <div style={{
                    padding: '0 16px 16px 16px',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    backgroundColor: '#F9FAFB'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px' }}>
                        <div>
                            <span style={{ fontWeight: 600, display: 'block' }}>Location</span>
                            {course.room}
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, display: 'block' }}>Status</span>
                            <span style={{ color: course.status === 'Open' ? '#059669' : '#DC2626' }}>
                                {course.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseCard;
