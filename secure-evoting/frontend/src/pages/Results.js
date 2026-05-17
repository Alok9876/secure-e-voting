import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Results = () => {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    API.get('/results').then(r=>setElections(r.data.elections||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="loading-overlay"><div className="spinner-border text-primary"/></div>;

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4"><i className="fas fa-chart-bar me-2 text-primary"/>Election Results</h4>
      {elections.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-chart-pie fa-3x text-muted mb-3"/><br/>
          <p className="text-muted">No closed elections yet. Results appear here after elections end.</p>
        </div>
      ) : (
        <div className="row g-4">
          {elections.map(e=>{
            const sorted = [...(e.candidates||[])].sort((a,b)=>b.voteCount-a.voteCount);
            const winner = sorted[0];
            const total  = sorted.reduce((s,c)=>s+c.voteCount,0);
            return (
              <div key={e._id} className="col-md-6">
                <div className="card election-card closed-card p-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-secondary">CLOSED</span>
                    <span className="small text-muted">{new Date(e.endDate).toLocaleDateString()}</span>
                  </div>
                  <h5 className="fw-bold">{e.title}</h5>
                  <p className="text-muted small">{e.constituency} · {total} total votes</p>
                  {winner && (
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="winner-badge"><i className="fas fa-trophy me-1"/>Winner</span>
                      <span className="fw-semibold">{winner.name} ({winner.party})</span>
                    </div>
                  )}
                  <Link to={`/results/${e._id}`} className="btn btn-outline-primary btn-sm">
                    View Full Results <i className="fas fa-arrow-right ms-1"/>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
