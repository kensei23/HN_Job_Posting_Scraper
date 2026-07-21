import React, {useState, useEffect} from "react";

function App(){
    // Create short-term memory
    const[jobs,setJobs] = useState([]);
    const[loading,setLoading] = useState(true);

    // Fetch data when page loads - recieves as messy JSON and turns it into readable JavaScript
    // [] at the end signals the fetch to run once and not every render
    useEffect(() => { fetch('http://127.0.0.1:8000/jobs').then((res) => res.json())
    .then((data) => { setJobs(data);setLoading(false);}).catch((err) => 
    {console.error("Error fetching jobs:", err);setLoading(false);});},[]);
    
    return (
        <div style = {{ backgroundColor:'#f8f9fa', minHeight: '100vh', padding: '40px 20px', 
        fontFamily: 'system-ui, -apple-system, sans-serif', color:'#212529'}}>
            <div style = {{ maxWidth: '900px', margin: '0 auto'}}>
                <header style={{ marginBottom: '32px', textAlign: 'center'}}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
                        HackerNews Job Board
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem'}}>
                        Connecting job searching developers with employee seeking companies.
                    </p>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280'}}>
                        <p style={{ fontSize: '1.2rem'}}>Loading jobs from FastAPI backend</p>
                    </div>
                ) : (
                    <div>

                        <div style={{ marginBottom: '20px', color: '#374151', fontWeight: '600'}}>
                            Showing {jobs.length} open position{jobs.length === 1 ? '' : 's'}
                        </div>

                        <div style={{ display: 'grid', gap: '20px'}}>
                            {jobs.map((job, index) => (
                                <div
                                key={index}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                    border: '1px solid #e5e7eb',
                                    textAlign: 'left'
                                }}
                                >

                                {/* Company Name / Job Role(s) */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px'}}>
                                    <div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                            {job.company_name || 'Unknown Company'}
                                        </span>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: '4px 0 0 0'}}>
                                            {job.role || 'Software Engineer'}
                                        </h2>
                                    </div>
                                </div>

                                {/* Remote status / Location details */}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center'}}>
                                    {job.location?.is_remote && (
                                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', borderRadius: '9999px'}}>
                                            🌐 Remote
                                        </span>
                                    )}
                                    {(job.location?.city || job.location?.country || job.location?.state) && (
                                        <span style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', fontWeight: '500', padding: '4px 10px', borderRadius: '9999px'}}>
                                            📍 {[job.location?.city, job.location?.state, job.location?.country].filter(Boolean).join(', ')}
                                        </span>
                                    )}
                                </div>
                            
                                {/* Tech Stack list */}
                                {job.salary_range && (
                                    <div style={{ fontSize: '0.95rem', color: '#059669', fontWeight: '600', marginBottom: '16px'}}>
                                        💰 {job.salary_range}
                                    </div>
                                )}

                                {job.tech_stack && job.tech_stack.length > 0 &&(
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px'}}>
                                        {job.tech_stack.map((item, idx) => {
                                            const skillName = typeof item === 'object' ? item.skill_name : item;
                                            return (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        backgroundColor: '#eff6ff',
                                                        color: '#1d4ed8',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '500',
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #bfdbfe'
                                                    }}
                                                >
                                                    {skillName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Contact / Apply Section */}
                                {(job.contact_info?.apply_contact || job.contact_info?.apply_url) && (
                                    <div>
                                        {job.contact_info?.apply_url ? (
                                            <a
                                                href={job.contact_info?.apply_url.startsWith('http') ? job.contact_info?.apply_url : 'https://${job.apply_url}'}
                                                target="blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    backgroundColor: '#2563eb',
                                                    color: '#ffffff',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    padding: '6px 14px',
                                                    borderRadius: '6px',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Apply Now ↗
                                            </a>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '500'}}>
                                                ✉️ Contact: <strong>{job.contact_info?.apply_contact}</strong>
                                            </span>
                                        )}
                                    </div>
                                )}

                            </div>
                            ))}
                        </div>
                    </div>
                )};
            </div>
        </div>
    )
}


export default App;