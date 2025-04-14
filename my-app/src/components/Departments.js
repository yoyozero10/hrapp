import React from 'react';

function Departments() {
  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm phòng ban..." />
        </div>
        <button className="btn-primary">
          <i className="fas fa-plus"></i> Thêm phòng ban
        </button>
      </header>

      <section className="content-section">
        <h2>Danh sách phòng ban</h2>
        <div className="departments-grid">
          <div className="department-card">
            <div className="department-header">
              <h3>Phòng Kinh doanh</h3>
              <span className="employee-count">15 nhân viên</span>
            </div>
            <div className="department-info">
              <p><i className="fas fa-user-tie"></i> Trưởng phòng: Nguyễn Văn A</p>
              <p><i className="fas fa-phone"></i> Số điện thoại: 0912.345.678</p>
            </div>
            <div className="department-actions">
              <button className="btn-icon"><i className="fas fa-edit"></i></button>
              <button className="btn-icon"><i className="fas fa-trash"></i></button>
            </div>
          </div>

          <div className="department-card">
            <div className="department-header">
              <h3>Phòng IT</h3>
              <span className="employee-count">8 nhân viên</span>
            </div>
            <div className="department-info">
              <p><i className="fas fa-user-tie"></i> Trưởng phòng: Trần Văn B</p>
              <p><i className="fas fa-phone"></i> Số điện thoại: 0987.654.321</p>
            </div>
            <div className="department-actions">
              <button className="btn-icon"><i className="fas fa-edit"></i></button>
              <button className="btn-icon"><i className="fas fa-trash"></i></button>
            </div>
          </div>

          <div className="department-card">
            <div className="department-header">
              <h3>Phòng Nhân sự</h3>
              <span className="employee-count">5 nhân viên</span>
            </div>
            <div className="department-info">
              <p><i className="fas fa-user-tie"></i> Trưởng phòng: Lê Thị C</p>
              <p><i className="fas fa-phone"></i> Số điện thoại: 0909.876.543</p>
            </div>
            <div className="department-actions">
              <button className="btn-icon"><i className="fas fa-edit"></i></button>
              <button className="btn-icon"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Departments; 