import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all data (client-side aggregate). Could be replaced by a dedicated stats endpoint later.
        const res = await api.get('/api/admissions/all');
        if (res.data?.success) setData(res.data.data || []);
        else setError('Failed to load stats');
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter(d => String(d.status) === 'Pending').length;
    const approved = data.filter(d => String(d.status) === 'Approved').length;
    const rejected = data.filter(d => String(d.status) === 'Rejected').length;

    const byCourse = {};
    data.forEach(d => {
      const c = d.academicCourse || 'Unknown';
      byCourse[c] = (byCourse[c] || 0) + 1;
    });

    const last7d = new Array(7).fill(0);
    const today = new Date();
    data.forEach(d => {
      const dt = new Date(d.applicationDate || d.createdAt);
      const diff = Math.floor((today - dt) / (1000*60*60*24));
      if (diff >= 0 && diff < 7) last7d[6 - diff] += 1; // oldest at index 0
    });

    return { total, pending, approved, rejected, byCourse, last7d };
  }, [data]);

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <h2>Admin Dashboard</h2>
        <p className="muted">Overview of applications and trends</p>
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}

      <div className="cards">
        <div className="card metric total">
          <div className="label">Total Applications</div>
          <div className="value">{loading ? '—' : stats.total}</div>
        </div>
        <div className="card metric pending">
          <div className="label">Pending</div>
          <div className="value">{loading ? '—' : stats.pending}</div>
        </div>
        <div className="card metric approved">
          <div className="label">Approved</div>
          <div className="value">{loading ? '—' : stats.approved}</div>
        </div>
        <div className="card metric rejected">
          <div className="label">Rejected</div>
          <div className="value">{loading ? '—' : stats.rejected}</div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-title">Applications by Course</div>
          <div className="bars">
            {loading ? (
              <div className="muted">Loading...</div>
            ) : (
              Object.entries(stats.byCourse).sort((a,b) => b[1]-a[1]).map(([course, count]) => (
                <div key={course} className="bar-row">
                  <div className="bar-label">{course}</div>
                  <div className="bar-track">
                    <div className="bar" style={{ width: `${Math.min(100, (count / Math.max(1, stats.total)) * 100)}%` }} />
                  </div>
                  <div className="bar-count">{count}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Last 7 Days - New Applications</div>
          <div className="spark">
            {loading ? (
              <div className="muted">Loading...</div>
            ) : (
              <div className="spark-bars">
                {stats.last7d.map((v, i) => (
                  <div key={i} className="spark-bar" style={{ height: `${10 + v * 8}px` }} title={`Day ${i+1}: ${v}`} />
                ))}
              </div>
            )}
          </div>
          <div className="spark-legend muted small">Older ➔ Newer</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
