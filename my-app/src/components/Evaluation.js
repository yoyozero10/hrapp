import React, { useState } from 'react';

function Evaluation() {
  const [evaluations, setEvaluations] = useState([
    { 
      id: 1, 
      employeeName: 'Nguyễn Văn A', 
      year: 2023, 
      quarter: 2, 
      score: 8.5, 
      note: 'Hoàn thành xuất sắc nhiệm vụ được giao' 
    },
    { 
      id: 2, 
      employeeName: 'Trần Thị B', 
      year: 2023, 
      quarter: 2, 
      score: 7.5, 
      note: 'Hoàn thành tốt nhiệm vụ, cần cải thiện kỹ năng giao tiếp' 
    },
    { 
      id: 3, 
      employeeName: 'Lê Văn C', 
      year: 2023, 
      quarter: 2, 
      score: 9.0, 
      note: 'Xuất sắc, có sáng kiến cải tiến quy trình làm việc' 
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    year: 2023,
    quarter: 2,
    score: 7.0,
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvaluation = {
      id: evaluations.length + 1,
      ...formData
    };
    setEvaluations([...evaluations, newEvaluation]);
    setShowForm(false);
    setFormData({
      employeeName: '',
      year: 2023,
      quarter: 2,
      score: 7.0,
      note: ''
    });
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'excellent-score';
    if (score >= 7) return 'good-score';
    if (score >= 5) return 'average-score';
    return 'poor-score';
  };

  return (
    <div className="main-content">
      <header className="header">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm đánh giá..." />
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Tạo đánh giá mới
        </button>
      </header>

      <section className="content-section">
        <div className="section-header">
          <h2>Đánh giá hiệu suất Q2/2023</h2>
          <div className="filters">
            <select defaultValue="2">
              <option value="1">Q1/2023</option>
              <option value="2">Q2/2023</option>
              <option value="3">Q3/2023</option>
              <option value="4">Q4/2023</option>
            </select>
          </div>
        </div>

        <div className="evaluation-stats">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Điểm trung bình</h3>
              <div className="icon">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
            <div className="stat-value">8.3</div>
            <div className="stat-label">+0.5 so với quý trước</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Nhân viên xuất sắc</h3>
              <div className="icon">
                <i className="fas fa-trophy"></i>
              </div>
            </div>
            <div className="stat-value">5</div>
            <div className="stat-label">25% tổng nhân viên</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <h3>Nhân viên cần cải thiện</h3>
              <div className="icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>
            <div className="stat-value">2</div>
            <div className="stat-label">10% tổng nhân viên</div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Quý/Năm</th>
                <th>Điểm số</th>
                <th>Nhận xét</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map(evaluation => (
                <tr key={evaluation.id}>
                  <td>{evaluation.employeeName}</td>
                  <td>Q{evaluation.quarter}/{evaluation.year}</td>
                  <td>
                    <span className={`score ${getScoreColor(evaluation.score)}`}>
                      {evaluation.score}
                    </span>
                  </td>
                  <td>{evaluation.note}</td>
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
            <h3>Tạo đánh giá mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nhân viên</label>
                <select
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  required
                >
                  <option value="">Chọn nhân viên</option>
                  <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                  <option value="Trần Thị B">Trần Thị B</option>
                  <option value="Lê Văn C">Lê Văn C</option>
                  <option value="Phạm Văn D">Phạm Văn D</option>
                </select>
              </div>
              <div className="form-group">
                <label>Năm</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                >
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quý</label>
                <select
                  value={formData.quarter}
                  onChange={(e) => setFormData({ ...formData, quarter: parseInt(e.target.value) })}
                  required
                >
                  <option value="1">Q1</option>
                  <option value="2">Q2</option>
                  <option value="3">Q3</option>
                  <option value="4">Q4</option>
                </select>
              </div>
              <div className="form-group">
                <label>Điểm số (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nhận xét</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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

export default Evaluation; 