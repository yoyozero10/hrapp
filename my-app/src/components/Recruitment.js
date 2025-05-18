import React, { useState, useEffect } from 'react';
import { recruitment } from '../services/api';

function Recruitment() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu mẫu fallback
  const mockJobs = [
    { id: 1, title: 'Lập trình viên React', department: 'IT', status: 'Đang tuyển' },
    { id: 2, title: 'Nhân viên nhân sự', department: 'HR', status: 'Đã đóng' }
  ];
  const mockCandidates = [
    { id: 1, name: 'Nguyễn Văn A', job: 'Lập trình viên React', email: 'a@example.com', status: 'Chờ duyệt' },
    { id: 2, name: 'Trần Thị B', job: 'Nhân viên nhân sự', email: 'b@example.com', status: 'Đã phỏng vấn' }
  ];

  useEffect(() => {
    fetchRecruitment();
  }, []);

  const fetchRecruitment = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobsRes = await recruitment.getJobs();
      const candidatesRes = await recruitment.getCandidates();
      setJobs(jobsRes && jobsRes.data ? jobsRes.data : mockJobs);
      setCandidates(candidatesRes && candidatesRes.data ? candidatesRes.data : mockCandidates);
      if (!jobsRes.data || !candidatesRes.data) setError('Không có dữ liệu từ máy chủ, hiển thị dữ liệu mẫu.');
    } catch (err) {
      setJobs(mockJobs);
      setCandidates(mockCandidates);
      setError('Không thể kết nối đến máy chủ. Hiển thị dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <div className="header-left">
          <i className="fas fa-user-plus"></i> Quản lý tuyển dụng
        </div>
      </div>
      <div className="content">
        <h2>Danh sách vị trí tuyển dụng</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vị trí</th>
                <th>Phòng ban</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Không có vị trí tuyển dụng</td></tr>
              ) : (
                jobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.department}</td>
                    <td>{job.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <h2 style={{ marginTop: 32 }}>Danh sách ứng viên</h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Vị trí ứng tuyển</th>
                <th>Email</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không có ứng viên</td></tr>
              ) : (
                candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.job}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Recruitment; 