import React, { useState } from 'react';

function Positions() {
  const [positions, setPositions] = useState([
    { id: 1, name: 'Giám đốc', description: 'Quản lý toàn bộ công ty', salary: '50,000,000' },
    { id: 2, name: 'Trưởng phòng', description: 'Quản lý phòng ban', salary: '30,000,000' },
    { id: 3, name: 'Nhân viên', description: 'Nhân viên thông thường', salary: '15,000,000' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    salary: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPosition = {
      id: positions.length + 1,
      ...formData
    };
    setPositions([...positions, newPosition]);
    setShowForm(false);
    setFormData({ name: '', description: '', salary: '' });
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm chức vụ..." />
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Thêm chức vụ
        </button>
      </header>

      <section className="content-section">
        <h2>Danh sách chức vụ</h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên chức vụ</th>
                <th>Mô tả</th>
                <th>Mức lương</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(position => (
                <tr key={position.id}>
                  <td>{position.name}</td>
                  <td>{position.description}</td>
                  <td>{position.salary} VNĐ</td>
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
            <h3>Thêm chức vụ mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên chức vụ</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mức lương</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
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

export default Positions; 