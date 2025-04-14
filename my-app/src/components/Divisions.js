import React, { useState } from 'react';

function Divisions() {
  const [divisions, setDivisions] = useState([
    { id: 1, name: 'Phòng Kinh doanh', manager: 'Nguyễn Văn A', employeeCount: 15 },
    { id: 2, name: 'Phòng IT', manager: 'Trần Văn B', employeeCount: 8 },
    { id: 3, name: 'Phòng Nhân sự', manager: 'Lê Thị C', employeeCount: 5 }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    employeeCount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDivision = {
      id: divisions.length + 1,
      ...formData
    };
    setDivisions([...divisions, newDivision]);
    setShowForm(false);
    setFormData({ name: '', manager: '', employeeCount: 0 });
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm bộ phận..." />
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Thêm bộ phận
        </button>
      </header>

      <section className="content-section">
        <h2>Danh sách bộ phận</h2>
        <div className="departments-grid">
          {divisions.map(division => (
            <div key={division.id} className="department-card">
              <div className="department-header">
                <h3>{division.name}</h3>
                <span className="employee-count">{division.employeeCount} nhân viên</span>
              </div>
              <div className="department-info">
                <p><i className="fas fa-user-tie"></i> Trưởng bộ phận: {division.manager}</p>
              </div>
              <div className="department-actions">
                <button className="btn-icon"><i className="fas fa-edit"></i></button>
                <button className="btn-icon"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thêm bộ phận mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên bộ phận</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trưởng bộ phận</label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số nhân viên</label>
                <input
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) })}
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

export default Divisions; 