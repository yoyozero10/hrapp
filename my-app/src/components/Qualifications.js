import React, { useState } from 'react';

function Qualifications() {
  const [qualifications, setQualifications] = useState([
    { id: 1, name: 'Đại học', description: 'Tốt nghiệp đại học', level: 'Cao đẳng/Đại học' },
    { id: 2, name: 'Cao đẳng', description: 'Tốt nghiệp cao đẳng', level: 'Cao đẳng/Đại học' },
    { id: 3, name: 'Trung cấp', description: 'Tốt nghiệp trung cấp', level: 'Trung cấp' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQualification = {
      id: qualifications.length + 1,
      ...formData
    };
    setQualifications([...qualifications, newQualification]);
    setShowForm(false);
    setFormData({ name: '', description: '', level: '' });
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm trình độ..." />
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Thêm trình độ
        </button>
      </header>

      <section className="content-section">
        <h2>Danh sách trình độ</h2>
        <div className="qualifications-grid">
          {qualifications.map(qualification => (
            <div key={qualification.id} className="qualification-card">
              <div className="qualification-header">
                <h3>{qualification.name}</h3>
                <span className="level-badge">{qualification.level}</span>
              </div>
              <div className="qualification-info">
                <p>{qualification.description}</p>
              </div>
              <div className="qualification-actions">
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
            <h3>Thêm trình độ mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên trình độ</label>
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
                <label>Cấp độ</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  required
                >
                  <option value="">Chọn cấp độ</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Cao đẳng/Đại học">Cao đẳng/Đại học</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>
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

export default Qualifications; 