import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';

const EMPTY = { name: '', party: '', symbol: '', manifesto: '' };

const AdminCandidates = () => {
  const { id }   = useParams(); // electionId
  const navigate = useNavigate();
  const [election,   setElection]   = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const fetchElection = async () => {
    try {
      const { data } = await API.get(`/admin/elections`);
      const el = data.elections?.find(e => e._id === id);
      if (el) { setElection(el); setCandidates(el.candidates || []); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchElection(); }, [id]);

  const handleAdd = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/admin/candidates', { ...form, electionId: id });
      toast.success(`${form.name} added as candidate!`);
      setForm(EMPTY);
      fetchElection();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add candidate.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async candidateId => {
    if (!window.confirm('Remove this candidate?')) return;
    try {
      await API.delete(`/admin/candidates/${candidateId}`);
      toast.success('Candidate removed.');
      fetchElection();
    } catch {
      toast.error('Failed to remove candidate.');
    }
  };

  const symbols = ['🌹','🌷','🌻','⚡','🔥','🌊','🦁','🐯','🕊️','⭐','🌙','☀️'];

  if (loading) return (
    <AdminLayout>
      <div className="loading-overlay"><div className="spinner-border text-primary" /></div>
    </AdminLayout>
  );

  if (!election) return (
    <AdminLayout>
      <div className="text-center py-5">
        <p className="text-danger">Election not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/elections')}>Back</button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/elections')}>
          <i className="fas fa-arrow-left" />
        </button>
        <div>
          <h4 className="fw-bold mb-0">Candidates — {election.title}</h4>
          <span className={`badge badge-${election.status}`}>{election.status}</span>
          <span className="badge bg-secondary ms-2">{election.constituency}</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Add candidate form */}
        <div className="col-md-5">
          <div className="card p-4">
            <h5 className="fw-bold mb-3"><i className="fas fa-user-plus me-2 text-primary" />Add Candidate</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name *</label>
                <input className="form-control" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Candidate's full name" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Party Name *</label>
                <input className="form-control" value={form.party}
                  onChange={e => setForm({ ...form, party: e.target.value })}
                  placeholder="Political party or affiliation" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Symbol / Emoji</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {symbols.map(s => (
                    <button key={s} type="button"
                      className={`btn btn-sm ${form.symbol === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setForm({ ...form, symbol: s })}
                      style={{ fontSize: '1.2rem', width: 40, height: 40, padding: 0 }}>
                      {s}
                    </button>
                  ))}
                </div>
                <input className="form-control" value={form.symbol}
                  onChange={e => setForm({ ...form, symbol: e.target.value })}
                  placeholder="Selected symbol shown above" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Manifesto / Bio</label>
                <textarea className="form-control" rows={2} value={form.manifesto}
                  onChange={e => setForm({ ...form, manifesto: e.target.value })}
                  placeholder="Brief candidate manifesto or biography…" />
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Adding…</>
                  : <><i className="fas fa-plus me-2" />Add Candidate</>}
              </button>
            </form>
          </div>
        </div>

        {/* Candidates list */}
        <div className="col-md-7">
          <div className="card p-4">
            <h5 className="fw-bold mb-3">
              <i className="fas fa-list me-2 text-primary" />
              Candidates ({candidates.length})
            </h5>
            {candidates.length === 0 ? (
              <div className="text-center py-4">
                <i className="fas fa-user-slash fa-2x text-muted mb-2" /><br />
                <p className="text-muted">No candidates added yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {candidates.map((c, i) => (
                  <div key={c._id} className="card p-3 border">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: 50, height: 50, borderRadius: '50%',
                          background: '#e8f0fe', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          {c.symbol || '🏳️'}
                        </div>
                        <div>
                          <div className="fw-bold">{c.name}</div>
                          <span className="badge bg-secondary">{c.party}</span>
                          {c.manifesto && (
                            <p className="text-muted small mt-1 mb-0">{c.manifesto.slice(0, 80)}…</p>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-info text-dark">
                          <i className="fas fa-vote-yea me-1" />{c.voteCount || 0} votes
                        </span>
                        {election.status !== 'closed' && (
                          <button className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(c._id)}>
                            <i className="fas fa-trash" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCandidates;
