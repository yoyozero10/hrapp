

-- Tạo bảng Bộ phận
CREATE TABLE bophan (
    idbp SERIAL PRIMARY KEY,
    tenbp VARCHAR(100) NOT NULL
);

-- Tạo bảng Phòng ban
CREATE TABLE phongban (
    idpb SERIAL PRIMARY KEY,
    tenpb VARCHAR(100) NOT NULL
);

-- Tạo bảng Chức vụ
CREATE TABLE chucvu (
    idcv SERIAL PRIMARY KEY,
    tencv VARCHAR(100) NOT NULL
);

-- Tạo bảng Trình độ
CREATE TABLE trinhdo (
    idtd SERIAL PRIMARY KEY,
    tentd VARCHAR(100) NOT NULL
);

-- Tạo bảng Nhân viên
CREATE TABLE nhanvien (
    manv SERIAL PRIMARY KEY,
    hoten VARCHAR(100) NOT NULL,
    gioitinh VARCHAR(10) CHECK (gioitinh IN ('Nam', 'Nữ', 'Khác')),
    ngaysinh DATE NOT NULL,
    dienthoai VARCHAR(15),
    cccd VARCHAR(20) UNIQUE NOT NULL,
    diachi TEXT,
    hinhanh TEXT,
    idpb INT REFERENCES phongban(idpb) ON DELETE SET NULL,
    idbp INT REFERENCES bophan(idbp) ON DELETE SET NULL,
    idcv INT REFERENCES chucvu(idcv) ON DELETE SET NULL,
    idtd INT REFERENCES trinhdo(idtd) ON DELETE SET NULL
);

-- Tạo bảng Bảo hiểm
CREATE TABLE baohiem (
    idbh SERIAL PRIMARY KEY,
    sobh VARCHAR(50) UNIQUE NOT NULL,
    ngaycap DATE NOT NULL,
    noicap VARCHAR(100),
    noikhambenh TEXT,
    manv INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE
);

-- Tạo bảng Hợp đồng
CREATE TABLE hopdong (
    sohd SERIAL PRIMARY KEY,
    ngaybatdau DATE NOT NULL,
    ngayketthuc DATE NOT NULL,
    ngayky DATE NOT NULL,
    noidung TEXT,
    manv INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE
);

-- Tạo bảng Loại công
CREATE TABLE loaicong (
    idlc SERIAL PRIMARY KEY,
    tenlc VARCHAR(100) NOT NULL,
    heso FLOAT NOT NULL
);

-- Tạo bảng Bảng công
CREATE TABLE bangcong (
    mabc SERIAL PRIMARY KEY,
    nam INT NOT NULL,
    thang INT NOT NULL,
    ngay DATE NOT NULL,
    giovao TIME,
    phutvao INT,
    giora TIME,
    phutra INT,
    manv INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE,
    idloaicong INT NOT NULL REFERENCES loaicong(idlc) ON DELETE CASCADE
);

-- Bảng Quản lý tài khoản người dùng
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    employeeid INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE
);

-- Bảng Vai trò (Phân quyền)
CREATE TABLE roles (
    roleid SERIAL PRIMARY KEY,
    rolename VARCHAR(50) UNIQUE NOT NULL
);

-- Bảng Quan hệ giữa tài khoản và vai trò
CREATE TABLE userroles (
    userroleid SERIAL PRIMARY KEY,
    userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
    roleid INT NOT NULL REFERENCES roles(roleid) ON DELETE CASCADE
);

-- Bảng Chấm công chi tiết
CREATE TABLE chamcong (
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE,
    ngay DATE NOT NULL,
    giovao TIME,
    giora TIME,
    sogiolam DECIMAL(5,2),
    loaicongid INT REFERENCES loaicong(idlc) ON DELETE SET NULL
);

-- Bảng Lương
CREATE TABLE luong (
    luongid SERIAL PRIMARY KEY,
    employeeid INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE,
    thang INT NOT NULL,
    nam INT NOT NULL,
    luongcoban DECIMAL(10,2) NOT NULL,
    phucap DECIMAL(10,2) DEFAULT 0,
    baohiem DECIMAL(10,2) DEFAULT 0,
    thunhapthuc DECIMAL(10,2) GENERATED ALWAYS AS (luongcoban + phucap - baohiem) STORED
);

-- Bảng Tuyển dụng
CREATE TABLE tuyendung (
    id SERIAL PRIMARY KEY,
    hoten VARCHAR(100) NOT NULL,
    ngaysinh DATE NOT NULL,
    dienthoai VARCHAR(15),
    email VARCHAR(100),
    vitri VARCHAR(100),
    trangthai VARCHAR(50) DEFAULT 'Đang xét duyệt'
);

-- Bảng Đánh giá hiệu suất nhân viên
CREATE TABLE danhgia (
    id SERIAL PRIMARY KEY,
    employeeid INT NOT NULL REFERENCES nhanvien(manv) ON DELETE CASCADE,
    nam INT NOT NULL,
    ky INT NOT NULL CHECK (ky BETWEEN 1 AND 4),
    diemso INT CHECK (diemso BETWEEN 1 AND 10),
    nhanxet TEXT
);
