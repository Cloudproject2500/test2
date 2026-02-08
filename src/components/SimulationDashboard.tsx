import React, { useState, useEffect } from 'react';

const SimulationDashboard: React.FC = () => {
    const [isSyncing, setIsSyncing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsSyncing(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const canvasData = [
        { item: '단어 시험 공부', source: '기초 스페인어', tag: '#Quiz', priority: '🔥 P1(긴급)', deadline: '2026-02-09' },
        { item: '다익스트라 구현', source: '알고리즘 설계', tag: '#Assignment', priority: '⚡ P2(높음)', deadline: '2026-02-10' },
        { item: '시장 조사 보고서', source: '마케팅 원론', tag: '#Project', priority: '🟢 P3(보통)', deadline: '2026-02-18' },
    ];

    const upcomingDeadlines = [
        { title: '단어 시험', course: '기초 스페인어', time: '내일 마감', color: '#EB5757' },
        { title: '다익스트라 구현', course: '알고리즘 설계', time: '2일 뒤 마감', color: '#F2994A' },
        { title: '시장 조사 보고서', course: '마케팅 원론', time: '10일 뒤 마감', color: '#27AE60' },
    ];

    const schedule = [
        { time: '10:00 - 12:00', task: '알고리즘 설계 (다익스트라)', icon: '💻' },
        { time: '14:00 - 15:30', task: '기초 스페인어 (단어 암기)', icon: '📖' },
        { time: '16:00 - 17:30', task: '마케팅 원론 (보고서 초안)', icon: '📊' },
    ];

    return (
        <main className="main-wrapper" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                {/* 1. 헤더 및 시각적 연결구조 */}
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '3rem',
                    padding: '2rem',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
                        <div style={{ fontWeight: 800, color: '#E13828' }}>Canvas</div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 2rem' }}>
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#3b82f6',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            animation: isSyncing ? 'pulse 1.5s infinite' : 'none'
                        }}>
                            {isSyncing ? 'Syncing...' : 'Connected'}
                        </div>
                        <div style={{
                            width: '100%',
                            height: '2px',
                            borderBottom: '2px dashed #cbd5e1',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {isSyncing && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: '30%',
                                    background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                                    animation: 'slide 2s infinite linear'
                                }} />
                            )}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
                        <div style={{ fontWeight: 800, color: '#3b82f6' }}>Taskmate</div>
                    </div>
                </header>

                {/* 3. 자동 변환 로직 시각화 */}
                <section className="premium-card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚙️</span> 자동 분류 엔진 (Auto-Classification Engine)
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>항목 명</th>
                                    <th style={{ padding: '1rem' }}>Canvas 소스</th>
                                    <th style={{ padding: '1rem' }}>분류 태그</th>
                                    <th style={{ padding: '1rem' }}>우선순위</th>
                                    <th style={{ padding: '1rem' }}>마감 기한</th>
                                </tr>
                            </thead>
                            <tbody>
                                {canvasData.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{row.item}</td>
                                        <td style={{ padding: '1rem' }}><span className="badge badge-blue">{row.source}</span></td>
                                        <td style={{ padding: '1rem' }}><span style={{ color: '#3b82f6' }}>{row.tag}</span></td>
                                        <td style={{ padding: '1rem' }}>{row.priority}</td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>{row.deadline}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    {/* [위젯 1]: Upcoming Deadlines */}
                    <section className="premium-card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>⏰ Upcoming Deadlines</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {upcomingDeadlines.map((item, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: '#fff',
                                    borderLeft: `4px solid ${item.color}`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}>
                                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                        <span style={{ color: '#64748b' }}>{item.course}</span>
                                        <span style={{ color: item.color, fontWeight: 600 }}>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* [위젯 2]: Study Schedule */}
                    <section className="premium-card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>📅 Today's Study Schedule</h3>
                        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                            <div style={{
                                position: 'absolute',
                                left: '0.25rem',
                                top: '0',
                                bottom: '0',
                                width: '2px',
                                background: '#e2e8f0'
                            }} />
                            {schedule.map((item, i) => (
                                <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '-1.55rem',
                                        top: '0.25rem',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: '#3b82f6',
                                        border: '2px solid #fff'
                                    }} />
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{item.time}</div>
                                    <div style={{ fontWeight: 600 }}>{item.icon} {item.task}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* [위젯 3]: Smart Sync Log */}
                <div style={{
                    background: '#ecfdf5',
                    border: '1px solid #10b981',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '3rem'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <div style={{ color: '#065f46', fontWeight: 600 }}>
                        Smart Sync Log: "Canvas에서 3개의 새로운 과제를 성공적으로 가져왔습니다"
                    </div>
                </div>

                {/* 보안 상태 표시줄 */}
                <footer style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    fontWeight: 500
                }}>
                    🛡️ Security Status: <span style={{ color: '#3b82f6' }}>Sandbox Mode (Demo Data)</span>
                </footer>
            </div>

            <style>{`
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(333%); }
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </main>
    );
};

export default SimulationDashboard;
