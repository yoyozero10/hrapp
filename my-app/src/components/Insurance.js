import React, { useState } from 'react';

function Insurance() {
  const [insurances, setInsurances] = useState([
    {
      id: 1,
      employeeName: 'Nguyễn Văn A',
      insuranceNumber: 'BH001',
      issueDate: '01/01/2023',
      issuePlace: 'Bảo hiểm xã hội Hà Nội',
      hospital: 'Bệnh viện Bạch Mai'
    },
    {
      id: 2,
      employeeName: 'Trần Thị B',
      insuranceNumber: 'BH002',
      issueDate: '15/02/2023',
      issuePlace: 'Bảo hiểm xã hội TP.HCM',
      hospital: 'Bệnh viện Chợ Rẫy'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    insuranceNumber: '',
    issueDate: '',
    issuePlace: '',
    hospital: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInsurance = {
      id: insurances.length + 1,
      ...formData
    };
    setInsurances([...insurances, newInsurance]);
    setShowForm(false);
    setFormData({
      employeeName: '',
      insuranceNumber: '',
      issueDate: '',
      issuePlace: '',
      hospital: ''
    });
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm bảo hiểm..." />
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Thêm bảo hiểm
        </button>
      </header>

      <section className="content-section">
        <h2>Danh sách bảo hiểm</h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Số bảo hiểm</th>
                <th>Ngày cấp</th>
                <th>Nơi cấp</th>
                <th>Nơi khám bệnh</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {insurances.map(insurance => (
                <tr key={insurance.id}>
                  <td>{insurance.employeeName}</td>
                  <td>{insurance.insuranceNumber}</td>
                  <td>{insurance.issueDate}</td>
                  <td>{insurance.issuePlace}</td>
                  <td>{insurance.hospital}</td>
                  <td>
                    <button className="btn-icon"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thêm thông tin bảo hiểm</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên nhân viên</label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số bảo hiểm</label>
                <input
                  type="text"
                  value={formData.insuranceNumber}
                  onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày cấp</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nơi cấp</label>
                <input
                  type="text"
                  value={formData.issuePlace}
                  onChange={(e) => setFormData({ ...formData, issuePlace: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nơi khám bệnh</label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insurance; 