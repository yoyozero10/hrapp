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
            <Link to="/attendance">
              <i className="fas fa-calendar-check"></i>
              <span>Chấm công</span>
            </Link>
          </li>
          <li>
            <Link to="/salary">
              <i className="fas fa-money-bill"></i>
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
              <span className="badge">2</span>
            </div>
            <div className="profile">
              <img src="/avatar.jpg" alt="User" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Xin chào, Admin!</h1>
          <p>Chào mừng bạn quay trở lại hệ thống quản lý nhân sự</p>
        </section>

        {/* Stats Section */}
        <section className="stats">
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
              <h3>Đánh giá hiệu suất</h3>
              <div className="icon">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
            <div className="stat-value">85%</div>
            <div className="stat-label">Hoàn thành</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Lương tháng này</h3>
              <div className="icon">
                <i className="fas fa-money-bill"></i>
              </div>
            </div>
            <div className="stat-value">$45,000</div>
            <div className="stat-label">Tổng chi phí</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="feature-group">
            <div className="feature-header">
              <i className="fas fa-clock"></i>
              <h3>Chấm công</h3>
            </div>
            <p>Theo dõi thời gian làm việc</p>
          </div>

          <div className="feature-group">
            <div className="feature-header">
              <i className="fas fa-chart-line"></i>
              <h3>Đánh giá hiệu suất</h3>
            </div>
            <p>Đánh giá và báo cáo KPI</p>
          </div>

          <div className="feature-group">
            <div className="feature-header">
              <i className="fas fa-money-bill"></i>
              <h3>Quản lý lương</h3>
            </div>
            <p>Tính toán và quản lý lương</p>
          </div>

          <div className="feature-group">
            <div className="feature-header">
              <i className="fas fa-user-plus"></i>
              <h3>Tuyển dụng</h3>
            </div>
            <p>Quản lý quy trình tuyển dụng</p>
          </div>
        </section>

        {/* Recent Notifications */}
        <section className="notifications-section">
          <h2>Thông báo gần đây</h2>
          
          <div className="notification-item">
            <div className="notification-header">
              <h4>Hạn chót nộp bảng chấm công</h4>
              <span className="time">2 giờ trước</span>
            </div>
            <p>Vui lòng nộp bảng chấm công tháng này trước ngày 30</p>
          </div>

          <div className="notification-item">
            <div className="notification-header">
              <h4>Đánh giá hiệu suất</h4>
              <span className="time">2 ngày trước</span>
            </div>
            <p>Bắt đầu đánh giá hiệu suất quý 2</p>
          </div>

          <div className="notification-item">
            <div className="notification-header">
              <h4>Tính lương tháng</h4>
              <span className="time">3 ngày trước</span>
            </div>
            <p>Chuẩn bị tính lương cho tháng này</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard; 