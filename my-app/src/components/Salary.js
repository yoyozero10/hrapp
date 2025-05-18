import React, { useState, useEffect } from 'react';
import { salary } from '../services/api';

function Salary() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2023);

  // Dữ liệu mẫu fallback
  const mockPayslips = [
    {
      id: 1,
      employeeName: 'Nguyễn Văn A',
      position: 'Giám đốc',
      department: 'Ban giám đốc',
      month: 7,
      year: 2023,
      baseSalary: 50000000,
      allowance: 5000000,
      insurance: 3000000,
      netSalary: 52000000,
      status: 'Đã thanh toán'
    },
    {
      id: 2,
      employeeName: 'Trần Thị B',
      position: 'Trưởng phòng',
      department: 'Nhân sự',
      month: 7,
      year: 2023,
      baseSalary: 30000000,
      allowance: 3000000,
      insurance: 1800000,
      netSalary: 31200000,
      status: 'Đã thanh toán'
    },
    {
      id: 3,
      employeeName: 'Lê Văn C',
      position: 'Nhân viên',
      department: 'IT',
      month: 7,
      year: 2023,
      baseSalary: 20000000,
      allowance: 1000000,
      insurance: 1200000,
      netSalary: 19800000,
      status: 'Đã thanh toán'
    }
  ];

  useEffect(() => {
    fetchPayslips();
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear]);

  const fetchPayslips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salary.getPayslips({ month: selectedMonth, year: selectedYear });
      if (response && response.data) {
        setPayslips(response.data);
      } else {
        setPayslips(mockPayslips);
        setError('Không có dữ liệu từ máy chủ, hiển thị dữ liệu mẫu.');
      }
    } catch (err) {
      setPayslips(mockPayslips);
      setError('Không thể kết nối đến máy chủ. Hiển thị dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm bảng lương..." />
        </div>
        <button className="btn-primary" onClick={() => setShowCalculateModal(true)}>
          <i className="fas fa-calculator"></i> Tính lương
        </button>
      </header>

      <section className="content-section">
        <div className="section-header">
          <h2>Bảng lương tháng 7/2023</h2>
          <div className="filters">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        <div className="salary-stats">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Tổng lương</h3>
              <div className="icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
            </div>
            <div className="stat-value">103.000.000 VNĐ</div>
            <div className="stat-label">+5% so với tháng trước</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Lương trung bình</h3>
              <div className="icon">
                <i className="fas fa-chart-bar"></i>
              </div>
            </div>
            <div className="stat-value">34.333.333 VNĐ</div>
            <div className="stat-label">3 nhân viên</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Trạng thái</h3>
              <div className="icon">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Đã thanh toán</div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Lương cơ bản</th>
                <th>Phụ cấp</th>
                <th>Bảo hiểm</th>
                <th>Lương thực lĩnh</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
              ) : payslips.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center' }}>Không có dữ liệu lương</td></tr>
              ) : (
                payslips.map(payslip => (
                  <tr key={payslip.id}>
                    <td>{payslip.employeeName || payslip.employee?.name}</td>
                    <td>{payslip.department || payslip.employee?.department?.name}</td>
                    <td>{payslip.position || payslip.employee?.position?.name}</td>
                    <td>{(payslip.baseSalary || payslip.base_salary || 0).toLocaleString('vi-VN')} VNĐ</td>
                    <td>{(payslip.allowance || payslip.allowance_amount || 0).toLocaleString('vi-VN')} VNĐ</td>
                    <td>{(payslip.insurance || payslip.insurance_amount || 0).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="salary-amount">{(payslip.netSalary || payslip.net_salary || 0).toLocaleString('vi-VN')} VNĐ</td>
                    <td>
                      <span className="status active">{payslip.status || payslip.status_text}</span>
                    </td>
                    <td>
                      <button className="btn-icon"><i className="fas fa-file-pdf"></i></button>
                      <button className="btn-icon"><i className="fas fa-edit"></i></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showCalculateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Tính lương tháng</h3>
            <form>
              <div className="form-group">
                <label>Tháng</label>
                <select defaultValue={8}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Năm</label>
                <select defaultValue={2023}>
                  <option value={2022}>2022</option>
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nhân viên</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked /> Tất cả nhân viên
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" /> Chọn theo phòng ban
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCalculateModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn-primary" onClick={() => setShowCalculateModal(false)}>
                  Tính lương
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Salary; 