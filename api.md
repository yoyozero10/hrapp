Method	Điều kiện	API Endpoint	Request Body / Query Params	Mục đích / Ghi chú Response
**Authentication**				
`POST`	[Không cần token]	`/api/auth/login`	`{ email": "..." password: "..." }`"	Đăng nhập, trả về `{ accessToken: '...', user: {...} }`
`GET`	[User/Admin]	`/api/auth/me`	(Không có)	Lấy thông tin user hiện tại, trả về `{ id, name, role, ... }`
**Dashboard**				
`GET`	[User/Admin]	`/api/dashboard/stats`	(Không có)	Lấy số liệu thống kê (totalEmployees, attendanceToday, etc.)
`GET`	[User/Admin]	`/api/dashboard/new-employees`	*Query Params:* `?limit=3` (ví dụ)	Lấy danh sách nhân viên mới nhất
`GET`	[User/Admin]	`/api/dashboard/recent-notifications`	*Query Params:* `?limit=3` (ví dụ)	Lấy danh sách thông báo gần đây
**Employees**				
`GET`	[User/Admin]	`/api/employees`	*Query Params:* `?page=1&limit=10&search=...&departmentId=...`	Lấy danh sách nhân viên (phân trang, lọc, tìm kiếm)
`GET`	[User/Admin]	`/api/employees/{employeeId}`	(Không có)	Lấy chi tiết một nhân viên
`POST`	[Admin]	`/api/employees`	`{ name: '...', email: '...', departmentId: ..., ... }`	Tạo mới nhân viên
`PUT`	[Admin]	`/api/employees/{employeeId}`	`{ name: '...', email: '...', ... }` (Thông tin cần cập nhật)	Cập nhật nhân viên
`DELETE`	[Admin]	`/api/employees/{employeeId}`	(Không có)	Xóa nhân viên
**Departments**				
`GET`	[User/Admin]	`/api/departments`	(Không có)	Lấy danh sách phòng ban `[{ id: ..., name: '...' }, ...]`
`POST`	[Admin]	`/api/departments`	`{ name": "..." }`"	Tạo mới phòng ban
`PUT`	[Admin]	`/api/departments/{departmentId}`	`{ name": "..." }`"	Cập nhật phòng ban
`DELETE`	[Admin]	`/api/departments/{departmentId}`	(Không có)	Xóa phòng ban
**Divisions**				Tương tự Departments
`GET`	[User/Admin]	`/api/divisions`	(Không có)	Lấy danh sách bộ phận
`POST`	[Admin]	`/api/divisions`	`{ name": "..." }`"	Tạo mới bộ phận
`PUT`	[Admin]	`/api/divisions/{divisionId}`	`{ name": "..." }`"	Cập nhật bộ phận
`DELETE`	[Admin]	`/api/divisions/{divisionId}`	(Không có)	Xóa bộ phận
**Positions**				Tương tự Departments
`GET`	[User/Admin]	`/api/positions`	(Không có)	Lấy danh sách chức vụ
`POST`	[Admin]	`/api/positions`	`{ name": "..." }`"	Tạo mới chức vụ
`PUT`	[Admin]	`/api/positions/{positionId}`	`{ name": "..." }`"	Cập nhật chức vụ
`DELETE`	[Admin]	`/api/positions/{positionId}`	(Không có)	Xóa chức vụ
**Qualifications**				Tương tự Departments
`GET`	[User/Admin]	`/api/qualifications`	(Không có)	Lấy danh sách trình độ
`POST`	[Admin]	`/api/qualifications`	`{ name": "..." }`"	Tạo mới trình độ
`PUT`	[Admin]	`/api/qualifications/{qualificationId}`	`{ name": "..." }`"	Cập nhật trình độ
`DELETE`	[Admin]	`/api/qualifications/{qualificationId}`	(Không có)	Xóa trình độ
**Contracts**				
`GET`	[User/Admin]	`/api/contracts`	*Query Params:* `?employeeId=...&status=...`	Lấy danh sách hợp đồng (lọc theo nhân viên, trạng thái...)
`GET`	[User/Admin]	`/api/contracts/{contractId}`	(Không có)	Lấy chi tiết hợp đồng
`POST`	[Admin]	`/api/contracts`	`{ employeeId: ..., type: '...', startDate: ..., ... }`	Tạo mới hợp đồng
`PUT`	[Admin]	`/api/contracts/{contractId}`	`{ type: '...', endDate: ..., ... }` (Thông tin cập nhật)	Cập nhật hợp đồng
`DELETE`	[Admin]	`/api/contracts/{contractId}`	(Không có)	Xóa hợp đồng
**Insurance**				*Cần định nghĩa chi tiết hơn*
`GET`	[User/Admin]	`/api/insurance`	*Query Params:* `?employeeId=...`	Lấy danh sách thông tin bảo hiểm
`POST`	[Admin]	`/api/insurance`	`{ employeeId: ..., policyNumber: ..., provider: ..., ... }`	Thêm thông tin bảo hiểm
`PUT`	[Admin]	`/api/insurance/{insuranceId}`	`{ policyNumber: ..., ... }`	Cập nhật thông tin bảo hiểm
`DELETE`	[Admin]	`/api/insurance/{insuranceId}`	(Không có)	Xóa thông tin bảo hiểm
**Attendance**				*Cần định nghĩa chi tiết hơn*
`GET`	[User/Admin]	`/api/attendance`	*Query Params:* `?employeeId=...&date=...&month=...`	Lấy dữ liệu chấm công (lọc theo nhân viên, ngày, tháng...)
`POST`	[User]	`/api/attendance/check-in`	`{ employeeId: ..., timestamp: ... }` (Hoặc tự động lấy giờ)	Check-in
`POST`	[User]	`/api/attendance/check-out`	`{ employeeId: ..., timestamp: ... }` (Hoặc tự động lấy giờ)	Check-out
`PUT`	[Admin]	`/api/attendance/{attendanceId}`	`{ checkInTime: ..., checkOutTime: ..., status: ... }`	Sửa dữ liệu chấm công (Admin)
**Salary**				*Cần định nghĩa chi tiết hơn*
`GET`	[User/Admin]	`/api/salary/payslips`	*Query Params:* `?employeeId=...&month=...&year=...`	Lấy phiếu lương
`GET`	[User/Admin]	`/api/salary/components`	(Không có)	Lấy các thành phần lương (lương cơ bản, phụ cấp...)
`POST`	[Admin]	`/api/salary/calculate`	`{ month: ..., year: ..., employeeIds: [...] }`	Yêu cầu tính lương cho nhân viên
**Recruitment**				*Cần định nghĩa chi tiết hơn*
`GET`	[User/Admin]	`/api/recruitment/jobs`	(Không có)	Lấy danh sách vị trí đang tuyển
`GET`	[User/Admin]	`/api/recruitment/candidates`	*Query Params:* `?jobId=...`	Lấy danh sách ứng viên (lọc theo vị trí)
`POST`	[Admin/HR]	`/api/recruitment/candidates`	`{ name: '...', email: '...', jobId: ..., cvUrl: ... }`	Thêm ứng viên mới
**Evaluation**				*Cần định nghĩa chi tiết hơn*
`GET`	[User/Admin]	`/api/evaluations`	*Query Params:* `?employeeId=...&period=...`	Lấy danh sách đánh giá
`POST`	[Admin/Manager]	`/api/evaluations`	`{ employeeId: ..., period: ..., criteria: [...], score: ... }`	Tạo đánh giá mới
**Settings**				*Cần định nghĩa các setting cụ thể*
`GET`	[Admin]	`/api/settings/{settingKey}`	(Không có)	Lấy một cài đặt cụ thể
`PUT`	[Admin]	`/api/settings/{settingKey}`	`{ value": "..." }`"	Cập nhật một cài đặt