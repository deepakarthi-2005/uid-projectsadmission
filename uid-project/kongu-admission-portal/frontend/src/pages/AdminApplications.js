import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import './AdminApplications.css';
import { useToast } from '../context/ToastContext';

const DEFAULT_PAGE_SIZE = 8;

const AdminApplications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'applicationDate', dir: 'desc' });
  const [expandedId, setExpandedId] = useState(null);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: DEFAULT_PAGE_SIZE, totalPages: 1 });
  const toast = useToast();

  // Fetch from server with filters, pagination, sorting
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page,
          limit: pageSize,
          sortKey: sortBy.key,
          sortDir: sortBy.dir,
        };
        if (statusFilter !== 'All') params.status = statusFilter;
        if (courseFilter !== 'All Courses') params.course = courseFilter;
        if (search && search.trim()) params.q = search.trim();
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        const res = await api.get('/api/admissions/all', { params });
        if (res.data?.success) {
          setData(res.data.data || []);
          if (res.data.meta) setMeta(res.data.meta);
          else setMeta({ total: res.data.count || (res.data.data || []).length, page: 1, limit: pageSize, totalPages: 1 });
        } else {
          setError('Failed to load applications');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, statusFilter, courseFilter, search, fromDate, toDate, sortBy]);

  // Unique course list for filter
  const courses = useMemo(() => {
    const set = new Set();
    data.forEach((d) => d.academicCourse && set.add(d.academicCourse));
    return ['All Courses', ...Array.from(set).sort()];
  }, [data]);

  // Status counts for pills
  const statusCounts = useMemo(() => {
    const counts = { All: data.length, Pending: 0, Approved: 0, Rejected: 0 };
    data.forEach((d) => {
      const s = String(d.status || 'Pending');
      if (counts[s] !== undefined) counts[s] += 1;
    });
    return counts;
  }, [data]);
  const totalPages = meta.totalPages || Math.max(1, Math.ceil((meta.total || data.length) / pageSize));
  const currentPage = Math.min(page, totalPages);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const toggleSort = (key) => {
    setPage(1);
    setSortBy((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      return { key, dir: 'asc' };
    });
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setNotice('');
      const res = await api.patch(`/api/admissions/${id}/status`, { status });
      if (res.data?.success) {
        setData((prev) => prev.map((d) => (d._id === id ? { ...d, status: res.data.data.status } : d)));
        toast.success(`Status updated to ${status}. Email notification triggered.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const resendEmail = async (id) => {
    try {
      setUpdatingId(id);
      setError('');
      setNotice('');
      const res = await api.post(`/api/admissions/${id}/resend-email`);
      if (res.data?.success) {
        toast.info('Email notification re-sent.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setUpdatingId(null);
    }
  };

  const toCSV = (rows) => {
    const headers = [
      'Application ID',
      'Full Name',
      'Email',
      'Phone',
      'Course',
      'City',
      'State',
      'Percentage',
      'Status',
      'Applied Date'
    ];
    const esc = (v) => {
      if (v === undefined || v === null) return '';
      const s = String(v).replaceAll('"', '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const body = rows.map((r) => [
      r._id,
      r.fullName,
      r.email,
      r.phone,
      r.academicCourse,
      r.city,
      r.state,
      r.percentage,
      r.status,
      new Date(r.applicationDate || r.createdAt).toLocaleString()
    ].map(esc).join(','));
    return [headers.join(','), ...body].join('\n');
  };

  const handleExport = async () => {
    try {
      // Fetch all rows matching current filters (no pagination) for export
      const params = {
        sortKey: sortBy.key,
        sortDir: sortBy.dir,
      };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (courseFilter !== 'All Courses') params.course = courseFilter;
      if (search && search.trim()) params.q = search.trim();
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await api.get('/api/admissions/all', { params });
      const rows = res.data?.data || [];
      const csv = toCSV(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      link.href = url;
      link.setAttribute('download', `kec_admissions_${ts}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError('Failed to export CSV');
    }
  };

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <div>
          <h2>Applications</h2>
          <p className="muted">Manage and review admission applications</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="search-box">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, phone, course, city, status..."
            />
          </div>
          <select
            className="course-filter"
            value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
          >
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <div className="date-range">
            <label className="muted small">From</label>
            <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
            <label className="muted small">To</label>
            <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
          </div>
          <button className="btn export" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      <div className="status-pills">
        {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
          <button
            key={s}
            className={`pill ${statusFilter === s ? 'active' : ''} ${s.toLowerCase()}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}
          >
            {s}
            <span className="count">{statusCounts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}

      <div className="card">
        {loading ? (
          <div className="center">Loading applications...</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort('fullName')}>
                    Applicant {sortBy.key === 'fullName' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => toggleSort('academicCourse')}>
                    Course {sortBy.key === 'academicCourse' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th className="sortable" onClick={() => toggleSort('percentage')}>
                    Percent {sortBy.key === 'percentage' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th className="sortable" onClick={() => toggleSort('status')}>
                    Status {sortBy.key === 'status' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th>Actions</th>
                  <th className="sortable" onClick={() => toggleSort('applicationDate')}>
                    Applied {sortBy.key === 'applicationDate' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="center muted">No applications found</td>
                  </tr>
                ) : (
                  data.map((a) => (
                    <>
                      <tr key={a._id} className="row-main" onClick={() => setExpandedId(expandedId === a._id ? null : a._id)}>
                        <td>
                          <div className="stack">
                            <span className="primary">{a.fullName}</span>
                            <span className="muted small">{a._id}</span>
                          </div>
                        </td>
                        <td>{a.academicCourse}</td>
                        <td>
                          <div className="stack">
                            <span className="small">{a.email}</span>
                            <span className="muted small">{a.phone}</span>
                          </div>
                        </td>
                        <td>{a.city}, {a.state}</td>
                        <td>{a.percentage}%</td>
                        <td>
                          <span className={`status ${String(a.status).toLowerCase()}`}>{a.status}</span>
                        </td>
                        <td>
                          {String(a.status) === 'Pending' ? (
                            <div className="actions" onClick={(e) => e.stopPropagation()}>
                              <button
                                className="btn approve"
                                onClick={() => updateStatus(a._id, 'Approved')}
                                disabled={updatingId === a._id}
                              >
                                {updatingId === a._id ? 'Updating...' : 'Approve'}
                              </button>
                              <button
                                className="btn reject"
                                onClick={() => updateStatus(a._id, 'Rejected')}
                                disabled={updatingId === a._id}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="muted small">—</span>
                          )}
                        </td>
                        <td>{new Date(a.applicationDate || a.createdAt).toLocaleDateString()}</td>
                      </tr>
                      {expandedId === a._id && (
                        <tr className="row-details">
                          <td colSpan={8}>
                            <div className="details">
                              <div className="details-grid">
                                <div>
                                  <div className="label">Gender</div>
                                  <div>{a.gender || '-'}</div>
                                </div>
                                <div>
                                  <div className="label">DOB</div>
                                  <div>{a.dateOfBirth ? new Date(a.dateOfBirth).toLocaleDateString() : '-'}</div>
                                </div>
                                <div>
                                  <div className="label">Address</div>
                                  <div>{a.address}, {a.city}, {a.state} - {a.pincode}</div>
                                </div>
                                <div>
                                  <div className="label">Qualification</div>
                                  <div>{a.previousQualification} ({a.percentage}%)</div>
                                </div>
                                <div>
                                  <div className="label">Father</div>
                                  <div>{a.fatherName}</div>
                                </div>
                                <div>
                                  <div className="label">Mother</div>
                                  <div>{a.motherName}</div>
                                </div>
                                <div>
                                  <div className="label">Guardian Phone</div>
                                  <div>{a.guardianPhone}</div>
                                </div>
                                <div>
                                  <div className="label">Applied At</div>
                                  <div>{new Date(a.applicationDate || a.createdAt).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="details-actions">
                                <button
                                  className="btn resend"
                                  onClick={() => resendEmail(a._id)}
                                  disabled={updatingId === a._id}
                                >
                                  {updatingId === a._id ? 'Sending...' : 'Resend Email'}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <div className="pagination">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="muted small">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {[8, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="muted small">Total: {meta.total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
