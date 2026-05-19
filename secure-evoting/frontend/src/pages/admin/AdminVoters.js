import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';
import API from '../../utils/api';

const AdminVoters = () => {
  const [voters,  setVoters]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all'); // all | pending | approved

  const fetchVoters = () => {
    API.get('/admin/voters').then(r => setVoters(r.data.voters || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVoters(); }, []);

  const handleApprove = async id => {
    try {
      await API.put(`/admin/voters/${id}/approve`);
      toast.success('Voter approved successfully!');
      fetchVoters();
    } catch {
      toast.error('Failed to approve voter.');
    }
  };

  const filtered = voters.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.email.toLowerCase().includes(search.toLowerCase()) ||
                        v.aadhaarNo?.includes(search);
    const matchFilter = filter === 'all' || (filter === 'pending' && !v.isApproved) || (filter === 'approved' && v.isApproved);
    return matchSearch && matchFilter;
  });

  const pendingCount  = voters.filter(v => !v.isApproved).length;
  const approvedCount = voters.filter(v => v.isApproved).length;

  return (
    <AdminLayout>
      <h4 className="fw-bold mb-4"><i className="fas fa-users me-2 text-primary" />Voter Management</h4>

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Voters',    value: voters.length,  cls: 'blue',   icon: 'fa-users'      },
          { label: 'Approved',        value: approvedCount,  cls: 'green',  icon: 'fa-check'      },
          { label: 'Pending Approval',value: pendingCount,   cls: 'orange', icon: 'fa-clock'      },
        ].map((s,i) => (
          <div key={i} className="col-4">
            <div className={`stat-card ${s.cls} text-center`}>
              <i className={`fas ${s.icon} mb-1`} />
              <div className="fs-4 fw-bold">{s.value}</div>
              <div className="small opacity-80">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 flex-wrap mb-3 align-items-center">
        <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search by name, email or Aadhaar…"
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="btn-group">
          {['all','pending','approved'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3" /><br />
          <p className="text-muted">No voters found.</p>
        </div>
      ) : (
        <div className="card p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                  <th>Constituency</th><th>Verified</th><th>Approved</th><th>Registered</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={v._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{v.name}</td>
                    <td>{v.email}</td>
                    <td>{v.phone}</td>
                    <td>{v.constituency}</td>
                    <td>
                      {v.isVerified
                        ? <span className="badge bg-success">✓ Yes</span>
                        : <span className="badge bg-secondary">No</span>}
                    </td>
                    <td>
                      {v.isApproved
                        ? <span className="badge bg-success">✓ Approved</span>
                        : <span className="badge bg-warning text-dark">Pending</span>}
                    </td>
                    <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!v.isApproved && (
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(v._id)}>
                          <i className="fas fa-check me-1" />Approve
                        </button>
                      )}
                      {v.isApproved && (
                        <span className="text-muted small">Active</span>
                      )}
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

export default AdminVoters;
