import React from 'react';

function Employees() {
  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm nhân viên..." />
        </div>
        <button className="btn-primary">
          <i className="fas fa-plus"></i> Thêm nhân viên
        </button>
      </header>

      <section className="content-section">
        <h2>Danh sách nhân viên</h2>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ tên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Ngày vào</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NV001</td>
                <td>Nguyễn Văn A</td>
                <td>Kinh doanh</td>
                <td>Nhân viên</td>
                <td>01/01/2023</td>
                <td><span className="status active">Đang làm việc</span></td>
                <td>
                  <button className="btn-icon"><i className="fas fa-edit"></i></button>
                  <button className="btn-icon"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
              {/* Thêm các dòng khác tương tự */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Employees; 