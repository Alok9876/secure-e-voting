// VerifyVote.js
import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const VerifyVote = () => {
  const [hash,    setHash]    = useState('');
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async e => {
    e.preventDefault();
    if (!hash.trim()) return toast.warning('Enter a receipt hash.');
    setLoading(true);
    try {
      const { data } = await API.get(`/votes/verify/${hash.trim()}`);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Receipt not found.');
      setResult(null);
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card p-4">
            <div className="text-center mb-4">
              <i className="fas fa-search-plus fa-2x mb-2" style={{color:'#1A3C6E'}}/>
              <h4 className="fw-bold">Verify Your Vote</h4>
              <p className="text-muted small">Enter your receipt hash to confirm your vote was recorded.</p>
            </div>
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Vote Receipt Hash</label>
                <input className="form-control font-monospace" value={hash} onChange={e=>setHash(e.target.value)}
                  placeholder="Paste your 64-character SHA-256 receipt hash here..." required />
              </div>
              <button className="btn btn-primary w-100 py-2 fw-semibold" type="submit" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Verifying...</> : <><i className="fas fa-shield-alt me-2"/>Verify Vote</>}
              </button>
            </form>

            {result && (
              <div className="alert alert-success mt-4">
                <h6 className="fw-bold"><i className="fas fa-check-circle me-2"/>Vote Verified!</h6>
                <p className="mb-1"><strong>Election:</strong> {result.vote.electionTitle}</p>
                <p className="mb-1"><strong>Status:</strong> {result.vote.electionStatus}</p>
                <p className="mb-1"><strong>Cast At:</strong> {new Date(result.vote.timestamp).toLocaleString()}</p>
                <p className="mb-0 small text-muted">Your vote was successfully recorded and counted.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyVote;
