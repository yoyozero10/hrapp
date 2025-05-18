import React, { useState, useEffect } from 'react';
import { attendance } from '../services/api';

function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu mẫu fallback
  const mockRecords = [
    {
      id: 1,
      date: '2023-07-01',
      employee: { name: 'Nguyễn Văn A' },
      checkIn: '08:00',
      checkOut: '17:00',
      status: 'Đúng giờ'
    },
    {
      id: 2,
      date: '2023-07-01',
      employee: { name: 'Trần Thị B' },
      checkIn: '08:15',
      checkOut: '17:05',
      status: 'Đi muộn'
    },
    {
      id: 3,
      date: '2023-07-01',
      employee: { name: 'Lê Văn C' },
      checkIn: '08:00',
      checkOut: '16:30',
      status: 'Về sớm'
    }
  ];

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendance.getAll();
      if (response && response.data) {
        setRecords(response.data);
      } else {
        setRecords(mockRecords);
        setError('Không có dữ liệu từ máy chủ, hiển thị dữ liệu mẫu.');
      }
    } catch (err) {
      setRecords(mockRecords);
      setError('Không thể kết nối đến máy chủ. Hiển thị dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <div className="header-left">
          <i className="fas fa-clock"></i> Quản lý chấm công
        </div>
      </div>
      <div className="content">
        <h2>Bảng chấm công và lịch sử</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Nhân viên</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không có dữ liệu chấm công</td></tr>
              ) : (
                records.map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.employee?.name || record.employeeName}</td>
                    <td>{record.checkIn || record.check_in}</td>
                    <td>{record.checkOut || record.check_out}</td>
                    <td>{record.status}</td>
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

export default Attendance; 