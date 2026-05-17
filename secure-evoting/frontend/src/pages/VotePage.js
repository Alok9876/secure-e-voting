import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';

const VotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election,  setElection]  = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [receipt,   setReceipt]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    API.get(`/elections/${id}`).then(r => setElection(r.data.election))
      .catch(()=>toast.error('Election not found.')).finally(()=>setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!selected) return toast.warning('Please select a candidate first.');
    if (!confirmed) return toast.warning('Please confirm your vote selection.');
    setSubmitting(true);
    try {
      const { data } = await API.post('/votes/cast', { electionId: id, candidateId: selected });
      setReceipt(data.receipt);
      toast.success('🎉 Vote cast successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cast vote.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-overlay"><div className="spinner-border text-primary"/></div>;
  if (!election) return <div className="container py-5 text-center"><h5 className="text-danger">Election not found.</h5></div>;
  if (election.hasVoted && !receipt) return (
    <div className="container py-5 text-center">
      <i className="fas fa-check-circle fa-3x text-success mb-3"/><br/>
      <h5>You have already voted in this election.</h5>
      <button className="btn btn-primary mt-3" onClick={()=>navigate('/elections')}>Back to Elections</button>
    </div>
  );

  // Receipt screen
  if (receipt) return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card p-4 text-center">
            <i className="fas fa-check-circle fa-3x text-success mb-3"/>
            <h4 className="fw-bold text-success">Vote Cast Successfully! 🎉</h4>
            <p className="text-muted">Your vote has been securely recorded and encrypted.</p>
            <div className="receipt-box my-4 text-start">
              <p className="mb-1"><strong>Election:</strong> {receipt.electionTitle}</p>
              <p className="mb-1"><strong>Timestamp:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
              <p className="mb-1"><strong>Receipt Hash:</strong></p>
              <code className="text-success">{receipt.receiptHash}</code>
            </div>
            <div className="alert alert-info small">
              <i className="fas fa-info-circle me-2"/>Save your receipt hash to verify your vote at any time using the <strong>Verify Vote</strong> page.
            </div>
            <div className="d-flex gap-2 justify-content-center mt-2">
              <button className="btn btn-outline-secondary" onClick={()=>navigator.clipboard.writeText(receipt.receiptHash).then(()=>toast.info('Copied!'))}>
                <i className="fas fa-copy me-1"/>Copy Receipt
              </button>
              <button className="btn btn-primary" onClick={()=>navigate('/dashboard')}>
                <i className="fas fa-home me-1"/>Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const selectedCandidate = election.candidates?.find(c=>c._id===selected);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-9">
          {/* Header */}
          <div className="card p-4 mb-4" style={{background:'linear-gradient(135deg,#1A3C6E,#2E75B6)',color:'#fff'}}>
            <div className="d-flex align-items-start gap-3">
              <i className="fas fa-vote-yea fa-2x mt-1"/>
              <div>
                <h5 className="fw-bold mb-1">{election.title}</h5>
                <p className="mb-1 opacity-75">{election.description}</p>
                <span className="badge bg-light text-primary">{election.constituency} Constituency</span>
                <span className="badge bg-warning text-dark ms-2">{election.candidates?.length} Candidates</span>
              </div>
            </div>
          </div>

          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"/>
            <strong>Important:</strong> Your vote is final and cannot be changed once submitted. Choose carefully.
          </div>

          {/* Candidate grid */}
          <h5 className="fw-bold mb-3">Select Your Candidate</h5>
          <div className="row g-3 mb-4">
            {election.candidates?.map(c=>(
              <div key={c._id} className="col-md-4 col-sm-6">
                <div
                  className={`card candidate-card p-3 text-center ${selected===c._id?'selected':''}`}
                  onClick={()=>{setSelected(c._id);setConfirmed(false);}}>
                  <div style={{width:56,height:56,borderRadius:'50%',background:'#e8f0fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 10px'}}>
                    {c.symbol || '🏳️'}
                  </div>
                  <h6 className="fw-bold mb-1">{c.name}</h6>
                  <span className="badge bg-secondary">{c.party}</span>
                  {c.manifesto && <p className="text-muted small mt-2 mb-0">{c.manifesto.slice(0,60)}…</p>}
                  {selected===c._id && (
                    <div className="mt-2"><span className="badge bg-primary"><i className="fas fa-check me-1"/>Selected</span></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation */}
          {selected && (
            <div className="card p-4 mb-4 border-primary">
              <h6 className="fw-bold mb-3">Confirm Your Selection</h6>
              <p className="mb-3">You are about to vote for <strong>{selectedCandidate?.name}</strong> ({selectedCandidate?.party}).</p>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="confirm"
                  checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>
                <label className="form-check-label" htmlFor="confirm">
                  I confirm this is my final choice and I understand this cannot be undone.
                </label>
              </div>
              <button className="btn btn-primary py-2 fw-semibold w-100"
                onClick={handleSubmit} disabled={!confirmed || submitting}>
                {submitting ? <><span className="spinner-border spinner-border-sm me-2"/>Submitting...</> : <><i className="fas fa-lock me-2"/>Submit Encrypted Vote</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePage;
