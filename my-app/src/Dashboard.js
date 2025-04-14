import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

function Dashboard() {
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>HR System</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="active">
              <i className="fas fa-home"></i>
              <span>Tổng quan</span>
            </Link>
          </li>
          <li>
            <Link to="/employees">
              <i className="fas fa-users"></i>
              <span>Nhân viên</span>
            </Link>
          </li>
          <li>
            <Link to="/departments">
              <i className="fas fa-building"></i>
              <span>Phòng ban</span>
            </Link>
          </li>
          <li>
            <Link to="/divisions">
              <i className="fas fa-layer-group"></i>
              <span>Bộ phận</span>
            </Link>
          </li>
          <li>
            <Link to="/positions">
              <i className="fas fa-user-tie"></i>
              <span>Chức vụ</span>
            </Link>
          </li>
          <li>
            <Link to="/qualifications">
              <i className="fas fa-graduation-cap"></i>
              <span>Trình độ</span>
            </Link>
          </li>
          <li>
            <Link to="/insurance">
              <i className="fas fa-file-medical"></i>
              <span>Bảo hiểm</span>
            </Link>
          </li>
          <li>
            <Link to="/attendance">
              <i className="fas fa-calendar-alt"></i>
              <span>Chấm công</span>
            </Link>
          </li>
          <li>
            <Link to="/salary">
              <i className="fas fa-money-bill-wave"></i>
              <span>Lương thưởng</span>
            </Link>
          </li>
          <li>
            <Link to="/evaluation">
              <i className="fas fa-chart-bar"></i>
              <span>Đánh giá</span>
            </Link>
          </li>
          <li>
            <Link to="/recruitment">
              <i className="fas fa-user-plus"></i>
              <span>Tuyển dụng</span>
            </Link>
          </li>
          <li>
            <Link to="/reports">
              <i className="fas fa-file-alt"></i>
              <span>Báo cáo</span>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <i className="fas fa-cog"></i>
              <span>Cài đặt</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <div className="user-info">
            <div className="notifications">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </div>
            <div className="profile">
              <img src="/avatar.jpg" alt="User" />
              <span className="name">Admin</span>
            </div>
          </div>
        </header>

        {/* Greeting Section */}
        <section className="greeting">
          <h1>Xin chào, Admin!</h1>
          <p>Chào mừng bạn quay trở lại hệ thống quản lý nhân sự</p>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Tổng nhân viên</h3>
              <div className="icon">
                <i className="fas fa-users"></i>
              </div>
            </div>
            <div className="stat-value">156</div>
            <div className="stat-label">+12% so với tháng trước</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Chấm công hôm nay</h3>
              <div className="icon">
                <i className="fas fa-calendar-check"></i>
              </div>
            </div>
            <div className="stat-value">142</div>
            <div className="stat-label">91% nhân viên</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Vị trí tuyển dụng</h3>
              <div className="icon">
                <i className="fas fa-briefcase"></i>
              </div>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-label">Đang mở</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Hợp đồng sắp hết hạn</h3>
              <div className="icon">
                <i className="fas fa-file-contract"></i>
              </div>
            </div>
            <div className="stat-value">5</div>
            <div className="stat-label">Cần gia hạn</div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features">
          <div className="feature-card">
            <i className="fas fa-user-tie"></i>
            <h3>Quản lý hồ sơ</h3>
            <p>Quản lý thông tin nhân viên</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-clock"></i>
            <h3>Chấm công</h3>
            <p>Theo dõi thời gian làm việc</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Đánh giá hiệu suất</h3>
            <p>Đánh giá và báo cáo KPI</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-money-bill-wave"></i>
            <h3>Quản lý lương</h3>
            <p>Tính toán và quản lý lương</p>
          </div>
        </section>

        {/* Notifications */}
        <section className="notifications-list">
          <h2>Thông báo gần đây</h2>
          <div className="notification">
            <div className="notification-header">
              <h4>Hạn chót nộp bảng chấm công</h4>
              <span className="time">2 giờ trước</span>
            </div>
            <p>Vui lòng nộp bảng chấm công tháng này trước ngày 30</p>
          </div>
          <div className="notification">
            <div className="notification-header">
              <h4>Cập nhật bảo hiểm</h4>
              <span className="time">1 ngày trước</span>
            </div>
            <p>Cần cập nhật thông tin bảo hiểm cho nhân viên mới</p>
          </div>
          <div className="notification">
            <div className="notification-header">
              <h4>Đánh giá hiệu suất</h4>
              <span className="time">2 ngày trước</span>
            </div>
            <p>Bắt đầu đánh giá hiệu suất quý 2</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard; 