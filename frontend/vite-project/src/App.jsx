import React, { useState, useEffect } from "react";

function JobCard({ job }) {
    const [expanded, setExpanded] = useState(false);

    const isValid = (val) => val && val !== "null" && val.trim() !== "" && val !== "None";

    // Format array of roles with comma separation
    const formattedRoles = Array.isArray(job.role) 
        ? job.role.join(", ") 
        : job.role || "Software Engineer";

    // Format Location
    const locationParts = [job.location?.city, job.location?.state, job.location?.country].filter(isValid);
    const locationString = locationParts.length > 0 ? locationParts.join(", ") : "Location: Unspecified";

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            border: '1px solid #e5e7eb',
            textAlign: 'left',
            transition: 'all 0.2s ease-in-out'
        }}>
            {/* Header / Summary View */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {job.company_name || 'Unknown Company'}
                    </span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: '4px 0 8px 0', lineHeight: '1.4' }}>
                        {formattedRoles}
                    </h2>
                </div>
            </div>

            {/* Badges / Quick Meta Info */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', margin: '8px 0 16px 0' }}>
                <span style={{ backgroundColor: job.location?.is_remote === 'remote' ? '#dcfce7' : '#f3f4f6', color: job.location?.is_remote === 'remote' ? '#166534' : '#374151', fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', borderRadius: '9999px' }}>
                    🌐 {job.location?.is_remote ? job.location.is_remote.toUpperCase() : 'LOCATION UNSPECIFIED'}
                </span>
                <span style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', fontWeight: '500', padding: '4px 10px', borderRadius: '9999px' }}>
                    📍 {locationString}
                </span>
            </div>

            {/* Expanded Content Section */}
            {expanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    {/* Summary */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563', margin: '0 0 6px 0' }}>Job Overview</h4>
                        <p style={{ fontSize: '0.925rem', color: '#374151', lineHeight: '1.5', margin: 0 }}>
                            {job.summary || "No overview provided for this listing."}
                        </p>
                    </div>

                    {/* Salary Info */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563', margin: '0 0 4px 0' }}>Salary Compensation</h4>
                        <span style={{ fontSize: '0.95rem', color: isValid(job.salary_range) ? '#059669' : '#6b7280', fontWeight: '600' }}>
                            💰 {isValid(job.salary_range) ? job.salary_range : "Not Specified"}
                        </span>
                    </div>

                    {/* Tech Stack */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563', margin: '0 0 8px 0' }}>Tech Stack & Skills</h4>
                        {job.tech_stack && job.tech_stack.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {job.tech_stack.map((item, idx) => {
                                    const skillName = typeof item === 'object' ? item.skill_name : item;
                                    const reqType = typeof item === 'object' && item.requirement_type ? ` (${item.requirement_type})` : '';
                                    return (
                                        <span key={idx} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.8rem', fontWeight: '500', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                                            {skillName}{reqType}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <span style={{ fontSize: '0.875rem', color: '#9ca3af', italic: 'true' }}>
                                Tech Stack: Not Specified
                            </span>
                        )}
                    </div>

                    {/* Contact & Apply Info */}
                    <div style={{ marginTop: '16px' }}>
                        {isValid(job.contact_info?.apply_url) ? (
                            <a
                                href={job.contact_info.apply_url.startsWith('http') ? job.contact_info.apply_url : `https://${job.contact_info.apply_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ backgroundColor: '#2563eb', color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}
                            >
                                Apply Now ↗
                            </a>
                        ) : isValid(job.contact_info?.apply_contact) ? (
                            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                                ✉️ Application Contact: <strong>{job.contact_info.apply_contact}</strong>
                            </span>
                        ) : (
                            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                Contact Info: Not Specified
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Toggle Expand / Collapse Button */}
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: '4px 8px'
                    }}
                >
                    {expanded ? 'Show Less ▲' : 'Show Details ▼'}
                </button>
            </div>
        </div>
    );
}

function App() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [remoteFilter, setRemoteFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [minSalaryFilter, setMinSalaryFilter] = useState('');

    useEffect(() => {
        setLoading(true);
        // Build URL search params for backend filters
        const params = new URLSearchParams();
        if (remoteFilter) params.append('is_remote', remoteFilter);
        if (locationFilter) params.append('location', locationFilter);
        if (minSalaryFilter) params.append('min_salary', minSalaryFilter);

        const url = `http://127.0.0.1:8000/jobs${params.toString() ? '?' + params.toString() : ''}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setJobs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching jobs:", err);
                setLoading(false);
            });
    }, [remoteFilter, locationFilter, minSalaryFilter]);

    // Client-side quick search (Search by company, role, or tech skills)
    const filteredJobs = jobs.filter((job) => {
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        const companyMatch = job.company_name?.toLowerCase().includes(q);
        
        const rolesString = Array.isArray(job.role) ? job.role.join(' ').toLowerCase() : (job.role || '').toLowerCase();
        const roleMatch = rolesString.includes(q);

        const techMatch = job.tech_stack?.some((t) => {
            const name = typeof t === 'object' ? t.skill_name : t;
            return name?.toLowerCase().includes(q);
        });

        return companyMatch || roleMatch || techMatch;
    });

    const resetFilters = () => {
        setSearchQuery('');
        setRemoteFilter('');
        setLocationFilter('');
        setMinSalaryFilter('');
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#212529' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <header style={{ marginBottom: '28px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                        HackerNews Job Board
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                        Connecting job searching developers with hiring companies.
                    </p>
                </header>

                {/* Filter & Search Bar Controls */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {/* Top Row: Main Keyword Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="🔍 Search roles, companies, or tech stack (e.g. React, Python, Backend)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Bottom Row: Specific Filters */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        
                        {/* Remote Status Filter */}
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                                WORK MODE
                            </label>
                            <select
                                value={remoteFilter}
                                onChange={(e) => setRemoteFilter(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                            >
                                <option value="">All Work Modes</option>
                                <option value="remote">Remote Only</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">Onsite</option>
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                                LOCATION
                            </label>
                            <input
                                type="text"
                                placeholder="City or Country..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Minimum Salary Filter */}
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '4px' }}>
                                MIN SALARY ($)
                            </label>
                            <select
                                value={minSalaryFilter}
                                onChange={(e) => setMinSalaryFilter(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                            >
                                <option value="">Any Salary</option>
                                <option value="50000">$50,000 / year</option>
                                <option value="100000">$100,000 / year</option>
                                <option value="150000">$150,000 / year</option>
                                <option value="200000">$200,000 / year</option>
                            </select>
                        </div>

                    </div>

                    {/* Reset Button */}
                    {(searchQuery || remoteFilter || locationFilter || minSalaryFilter) && (
                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={resetFilters}
                                style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                        <p style={{ fontSize: '1.2rem' }}>Loading jobs...</p>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '16px', color: '#374151', fontWeight: '600', fontSize: '0.95rem' }}>
                            Showing {filteredJobs.length} open position{filteredJobs.length === 1 ? '' : 's'}
                        </div>

                        {filteredJobs.length === 0 ? (
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', border: '1px solid #e5e7eb', color: '#6b7280' }}>
                                <p style={{ fontSize: '1.1rem', margin: 0 }}>No jobs matched your filter criteria.</p>
                                <button
                                    onClick={resetFilters}
                                    style={{ marginTop: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {filteredJobs.map((job, index) => (
                                    <JobCard key={index} job={job} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;