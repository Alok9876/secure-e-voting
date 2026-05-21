// Elections.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');

  useEffect(() => {
    API.get('/elections').then(r => setElections(r.data.elections || []))
      .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const filtered = elections.filter(e => filter === 'all' || e.status === filter);

  if (loading) return <div className="loading-overlay"><div className="spinner-border text-primary"/></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0"><i className="fas fa-poll me-2 text-primary"/>Elections</h4>
        <div className="btn-group">
          {['all','active','upcoming'].map(f=>(
            <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline-primary'}`}
              onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-inbox fa-3x text-muted mb-3"/><br/>
          <p className="text-muted">No elections found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(e=>(
            <div key={e._id} className="col-md-6">
              <div className={`card election-card h-100 p-4 ${e.status==='active'?'active-card':''}`}>
                <div className="d-flex justify-content-between mb-2">
                  <span className={`badge badge-${e.status}`}>
                    {e.status==='active'?'🟢':'🟡'} {e.status.toUpperCase()}
                  </span>
                  {e.hasVoted && <span className="badge bg-success">✓ Voted</span>}
                </div>
                <h5 className="fw-bold">{e.title}</h5>
                <p className="text-muted small mb-2">{e.description || 'No description provided.'}</p>
                <div className="small text-muted mb-3">
                  <i className="fas fa-map-marker-alt me-1"/>{e.constituency} &nbsp;|&nbsp;
                  <i className="fas fa-users me-1"/>{e.candidates?.length||0} Candidates &nbsp;|&nbsp;
                  <i className="fas fa-vote-yea me-1"/>{e.totalVotesCast||0} Votes
                </div>
                <div className="small text-muted mb-3">
                  📅 {new Date(e.startDate).toLocaleDateString()} → {new Date(e.endDate).toLocaleDateString()}
                </div>
                <div className="mt-auto">
                  {e.status==='active' && !e.hasVoted && (
                    <Link to={`/vote/${e._id}`} className="btn btn-primary w-100">
                      <i className="fas fa-vote-yea me-2"/>Cast Your Vote
                    </Link>
                  )}
                  {e.hasVoted && (
                    <button className="btn btn-success w-100" disabled>
                      <i className="fas fa-check-circle me-2"/>Vote Cast Successfully
                    </button>
                  )}
                  {e.status==='upcoming' && (
                    <button className="btn btn-outline-secondary w-100" disabled>
                      <i className="fas fa-clock me-2"/>Opens {new Date(e.startDate).toLocaleDateString()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Elections;
