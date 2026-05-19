import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [el, vh] = await Promise.all([
          API.get('/elections'),
          API.get('/votes/my-history'),
        ]);
        setElections(el.data.elections || []);
        setHistory(vh.data.votes || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const activeCount  = elections.filter(e => e.status === 'active' && !e.hasVoted).length;
  const votedCount   = history.length;

  if (loading) return <div className="loading-overlay"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container py-4">
      {/* Welcome banner */}
      <div className="card mb-4 p-4" style={{background:'linear-gradient(135deg,#1A3C6E,#2E75B6)',color:'#fff',border:'none'}}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1">Welcome, {user?.name}! 👋</h4>
            <p className="mb-1 opacity-75"><i className="fas fa-map-marker-alt me-1" />{user?.constituency} Constituency</p>
            <p className="mb-0 opacity-75"><i className="fas fa-envelope me-1" />{user?.email}</p>
          </div>
          <div className="text-end">
            <span className="badge bg-success fs-6 px-3 py-2">
              <i className="fas fa-check-circle me-1" />Verified Voter
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label:'Active Elections',  val: activeCount,  icon:'fa-poll',         cls:'blue'   },
          { label:'Votes Cast',        val: votedCount,   icon:'fa-vote-yea',     cls:'green'  },
          { label:'Total Elections',   val: elections.length, icon:'fa-calendar', cls:'orange' },
          { label:'Security Status',   val: '🔒 Secure',  icon:'fa-shield-alt',  cls:'red'    },
        ].map((s,i)=>(
          <div key={i} className="col-6 col-md-3">
            <div className={`stat-card ${s.cls}`}>
              <i className={`fas ${s.icon} fa-lg mb-2`} />
              <div className="fs-4 fw-bold">{s.val}</div>
              <div className="small opacity-80">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Active Elections */}
        <div className="col-md-7">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0"><i className="fas fa-poll me-2 text-primary" />Active Elections</h5>
              <Link to="/elections" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            {elections.filter(e=>e.status==='active').length === 0 ? (
              <p className="text-muted text-center py-3">No active elections at the moment.</p>
            ) : (
              elections.filter(e=>e.status==='active').map(e=>(
                <div key={e._id} className="card election-card active-card p-3 mb-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-bold mb-1">{e.title}</h6>
                      <span className="badge bg-secondary me-1">{e.constituency}</span>
                      <span className="small text-muted">· {e.candidates?.length || 0} candidates</span>
                    </div>
                    {e.hasVoted ? (
                      <span className="badge bg-success">✓ Voted</span>
                    ) : (
                      <Link to={`/vote/${e._id}`} className="btn btn-sm btn-primary">Vote Now</Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vote History */}
        <div className="col-md-5">
          <div className="card p-4">
            <h5 className="fw-bold mb-3"><i className="fas fa-history me-2 text-success" />My Vote History</h5>
            {history.length === 0 ? (
              <p className="text-muted text-center py-3">You haven't voted yet.</p>
            ) : (
              history.map(v=>(
                <div key={v._id} className="border-bottom pb-2 mb-2">
                  <div className="fw-semibold small">{v.election?.title}</div>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <span className="badge bg-success">✓ Voted</span>
                    <span className="text-muted" style={{fontSize:'0.75rem'}}>
                      {new Date(v.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-muted mt-1" style={{fontSize:'0.72rem',wordBreak:'break-all'}}>
                    Receipt: {v.receiptHash?.slice(0,32)}…
                  </div>
                </div>
              ))
            )}
            <Link to="/verify" className="btn btn-outline-success btn-sm w-100 mt-2">
              <i className="fas fa-search me-1" />Verify a Vote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
