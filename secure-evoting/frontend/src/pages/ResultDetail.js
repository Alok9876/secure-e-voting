import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import API from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/results/${id}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-overlay"><div className="spinner-border text-primary" /></div>;
  if (!data)   return (
    <div className="container py-5 text-center">
      <h5 className="text-danger">Results not available yet.</h5>
      <button className="btn btn-primary mt-3" onClick={() => navigate('/results')}>Back</button>
    </div>
  );

  const { election, winner, results } = data;

  const chartData = {
    labels: results.map(r => r.name),
    datasets: [{
      label: 'Votes Received',
      data:  results.map(r => r.votes),
      backgroundColor: results.map((_, i) =>
        i === 0 ? 'rgba(25,135,84,0.85)' : `rgba(26,60,110,${0.7 - i * 0.1})`),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title:  { display: true, text: `${election.title} — Vote Distribution`, font: { size: 15 } },
    },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary btn-sm mb-4" onClick={() => navigate('/results')}>
        <i className="fas fa-arrow-left me-2" />Back to Results
      </button>

      {/* Election info */}
      <div className="card p-4 mb-4" style={{ background: 'linear-gradient(135deg,#1A3C6E,#2E75B6)', color: '#fff' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <h4 className="fw-bold mb-1">{election.title}</h4>
            <p className="mb-1 opacity-75">
              <i className="fas fa-map-marker-alt me-1" />{election.constituency} &nbsp;|&nbsp;
              <i className="fas fa-vote-yea me-1" />{election.totalVotesCast} Total Votes
            </p>
            <p className="mb-0 opacity-75 small">
              {new Date(election.startDate).toLocaleDateString()} → {new Date(election.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <span className="badge bg-light text-dark fs-6 px-3 py-2">
              <i className="fas fa-check-circle text-success me-2" />Election Closed
            </span>
          </div>
        </div>
      </div>

      {/* Winner banner */}
      <div className="card p-4 mb-4 border-0" style={{ background: 'linear-gradient(135deg,#155724,#28a745)', color: '#fff' }}>
        <div className="d-flex align-items-center gap-3">
          <i className="fas fa-trophy fa-2x" style={{ color: '#FFD700' }} />
          <div>
            <div className="small opacity-75 mb-1">🏆 WINNER</div>
            <h5 className="fw-bold mb-0">{winner.name}</h5>
            <div>{winner.party} &nbsp;·&nbsp; {winner.votes} votes &nbsp;·&nbsp; {winner.percentage}%</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Table */}
        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="fw-bold mb-3">Detailed Tally</h5>
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Candidate</th><th>Party</th><th>Votes</th><th>%</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.candidateId} className={i === 0 ? 'table-success' : ''}>
                    <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                    <td className="fw-semibold">{r.name}</td>
                    <td>{r.party}</td>
                    <td><strong>{r.votes}</strong></td>
                    <td>{r.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="col-md-6">
          <div className="card p-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetail;
