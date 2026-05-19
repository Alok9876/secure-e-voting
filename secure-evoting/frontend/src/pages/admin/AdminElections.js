import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';

const EMPTY = { title: '', description: '', constituency: 'General', startDate: '', endDate: '' };

const AdminElections = () => {
  const [elections, setElections] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [form,      setForm]      = useState(EMPTY);
  const [submitting,setSubmitting]= useState(false);
  const [showForm,  setShowForm]  = useState(false);

  const fetchElections = () => {
    API.get('/admin/elections').then(r => setElections(r.data.elections || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchElections(); }, []);

  const handleCreate = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/admin/elections', form);
      toast.success('Election created successfully!');
      setForm(EMPTY);
      setShowForm(false);
      fetchElections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create election.');
    } finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/elections/${id}/status`, { status });
      toast.success(`Election marked as ${status}.`);
      fetchElections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this election? This cannot be undone.')) return;
    try {
      await API.delete(`/admin/elections/${id}`);
      toast.success('Election deleted.');
      fetchElections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete active election.');
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0"><i className="fas fa-poll me-2 text-primary" />Manage Elections</h4>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`fas fa-${showForm ? 'times' : 'plus'} me-2`} />
          {showForm ? 'Cancel' : 'Create Election'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-4 mb-4 border-primary">
          <h5 className="fw-bold mb-3">New Election</h5>
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Election Title *</label>
                <input className="form-control" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Student Council Election 2025" required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Constituency</label>
                <select className="form-select" value={form.constituency}
                  onChange={e => setForm({ ...form, constituency: e.target.value })}>
                  {['General','North','South','East','West','Central'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows={2} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the election..." />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Start Date & Time *</label>
                <input className="form-control" type="datetime-local" value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">End Date & Time *</label>
                <input className="form-control" type="datetime-local" value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })} required />
              </div>
              <div className="col-12">
                <button className="btn btn-success px-4" type="submit" disabled={submitting}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : <><i className="fas fa-check me-2" />Create Election</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Elections table */}
      {loading ? (
        <div className="loading-overlay"><div className="spinner-border text-primary" /></div>
      ) : elections.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-poll fa-3x text-muted mb-3" /><br />
          <p className="text-muted">No elections yet. Create one above.</p>
        </div>
      ) : (
        <div className="card p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Title</th><th>Constituency</th><th>Status</th>
                  <th>Candidates</th><th>Votes</th><th>End Date</th><th>Actions</th>
                </tr>
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
                    <td>{e.candidates?.length || 0}</td>
                    <td>{e.totalVotesCast || 0}</td>
                    <td>{new Date(e.endDate).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/admin/candidates/${e._id}`} className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-users-cog" /> Candidates
                        </Link>
                        {e.status === 'upcoming' && (
                          <button className="btn btn-sm btn-success"
                            onClick={() => handleStatusChange(e._id, 'active')}>Open</button>
                        )}
                        {e.status === 'active' && (
                          <button className="btn btn-sm btn-warning"
                            onClick={() => handleStatusChange(e._id, 'closed')}>Close</button>
                        )}
                        {e.status !== 'active' && (
                          <button className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(e._id)}>
                            <i className="fas fa-trash" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminElections;
