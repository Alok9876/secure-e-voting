import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';

const StatCard = ({ label, value, icon, cls }) => (
  <div className={`stat-card ${cls}`}>
    <i className={`fas ${icon} fa-2x mb-2 opacity-80`} />
    <div className="fs-2 fw-bold">{value}</div>
    <div className="small opacity-80">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats,     setStats]     = useState(null);
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/elections'),
    ]).then(([s, e]) => {
      setStats(s.data.stats);
      setElections(e.data.elections?.slice(0, 5) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="loading-overlay"><div className="spinner-border text-primary" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <h4 className="fw-bold mb-4"><i className="fas fa-tachometer-alt me-2 text-primary" />Admin Dashboard</h4>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><StatCard label="Total Voters"    value={stats?.totalVoters    ?? 0} icon="fa-users"     cls="blue"   /></div>
        <div className="col-6 col-md-3"><StatCard label="Total Elections" value={stats?.totalElections ?? 0} icon="fa-poll"      cls="orange" /></div>
        <div className="col-6 col-md-3"><StatCard label="Active Now"      value={stats?.activeElections?? 0} icon="fa-circle"    cls="green"  /></div>
        <div className="col-6 col-md-3"><StatCard label="Total Votes"     value={stats?.totalVotes     ?? 0} icon="fa-vote-yea"  cls="red"    /></div>
      </div>

      {/* Pending approvals alert */}
      {stats?.pendingApproval > 0 && (
        <div className="alert alert-warning d-flex align-items-center gap-3 mb-4">
          <i className="fas fa-user-clock fa-lg" />
          <div>
            <strong>{stats.pendingApproval} voter(s)</strong> are awaiting approval.
            <a href="/admin/voters" className="ms-2 fw-semibold">Review now →</a>
          </div>
        </div>
      )}

      {/* Recent elections table */}
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0"><i className="fas fa-list me-2 text-primary" />Recent Elections</h5>
          <a href="/admin/elections" className="btn btn-sm btn-outline-primary">Manage All</a>
        </div>
        {elections.length === 0 ? (
          <p className="text-muted text-center py-3">No elections created yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr><th>Title</th><th>Constituency</th><th>Status</th><th>Votes Cast</th><th>End Date</th></tr>
              </thead>
              <tbody>
                {elections.map(e => (
                  <tr key={e._id}>
                    <td className="fw-semibold">{e.title}</td>
                    <td>{e.constituency}</td>
                    <td>
                      <span className={`badge badge-${e.status}`}>
                        {e.status === 'active' ? '🟢' : e.status === 'upcoming' ? '🟡' : '⚫'} {e.status}
                      </span>
                    </td>
                    <td>{e.totalVotesCast}</td>
                    <td>{new Date(e.endDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
