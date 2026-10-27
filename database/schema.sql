CREATE DATABASE IF NOT EXISTS smartpak_db;
USE smartpak_db;

--Schema
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Operator', 'Customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('Car', 'Motorcycle', 'EV') NOT NULL,
    color VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE RFID_Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    rfid_code VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE
);

CREATE TABLE Parking_Zones (
    zone_id INT AUTO_INCREMENT PRIMARY KEY,
    zone_name VARCHAR(50) NOT NULL,
    floor_level INT NOT NULL,
    capacity INT NOT NULL,
    zone_type ENUM('Standard', 'VIP', 'EV', 'Disabled') NOT NULL
);

CREATE TABLE Parking_Spots (
    spot_id INT AUTO_INCREMENT PRIMARY KEY,
    zone_id INT NOT NULL,
    spot_number VARCHAR(10) NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    FOREIGN KEY (zone_id) REFERENCES Parking_Zones(zone_id) ON DELETE CASCADE,
    UNIQUE(zone_id, spot_number)
);

CREATE TABLE Tariff_Rules (
    tariff_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type ENUM('Car', 'Motorcycle', 'EV') NOT NULL,
    base_rate DECIMAL(10, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    daily_max DECIMAL(10, 2) NOT NULL,
    grace_period INT NOT NULL COMMENT 'Grace period in minutes'
);

CREATE TABLE Reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spot_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('Pending', 'Active', 'Completed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES Parking_Spots(spot_id) ON DELETE CASCADE
);

CREATE TABLE Parking_Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    spot_id INT NOT NULL,
    entry_timestamp DATETIME NOT NULL,
    exit_timestamp DATETIME,
    status ENUM('Active', 'Completed') DEFAULT 'Active',
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    FOREIGN KEY (spot_id) REFERENCES Parking_Spots(spot_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    method ENUM('Cash', 'Card', 'Digital Wallet') NOT NULL,
    status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES Parking_Sessions(session_id)
);

CREATE TABLE Audit_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

--Seed
USE smartpak_db;


INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES
('Alice', 'Admin', 'admin@smartpak.local', 'hashed_pw_1', 'Admin'),
('Bob', 'Gatekeeper', 'operator@smartpak.local', 'hashed_pw_2', 'Operator'),
('Charlie', 'Driver', 'charlie@example.com', 'hashed_pw_3', 'Customer'),
('Diana', 'Rider', 'diana@example.com', 'hashed_pw_4', 'Customer');


INSERT INTO Vehicles (user_id, license_plate, vehicle_type, color) VALUES
(3, 'ABC-1234', 'Car', 'Silver'),
(3, 'EV-9999', 'EV', 'White'),
(4, 'MOTO-55', 'Motorcycle', 'Black');


INSERT INTO RFID_Tags (vehicle_id, rfid_code, issue_date, is_active) VALUES
(1, 'RFID-001-CAR', '2026-10-01', TRUE),
(2, 'RFID-002-EV', '2026-10-15', TRUE),
(3, 'RFID-003-MOTO', '2026-10-20', TRUE);


INSERT INTO Parking_Zones (zone_name, floor_level, capacity, zone_type) VALUES
('North Wing A', 1, 50, 'Standard'),
('EV Chargers Hub', 1, 10, 'EV'),
('VIP Platinum', 2, 20, 'VIP');


INSERT INTO Parking_Spots (zone_id, spot_number, status) VALUES
(1, 'A-01', 'Occupied'),
(1, 'A-02', 'Available'),
(2, 'EV-01', 'Available'),
(3, 'VIP-01', 'Maintenance');


INSERT INTO Tariff_Rules (vehicle_type, base_rate, hourly_rate, daily_max, grace_period) VALUES
('Car', 50.00, 20.00, 300.00, 15),
('Motorcycle', 30.00, 10.00, 150.00, 15),
('EV', 60.00, 25.00, 400.00, 15);

INSERT INTO Reservations (user_id, spot_id, start_time, end_time, status) VALUES
(4, 2, '2026-10-27 09:00:00', '2026-10-27 12:00:00', 'Pending');


INSERT INTO Parking_Sessions (vehicle_id, spot_id, entry_timestamp, exit_timestamp, status) VALUES
(1, 1, '2026-10-26 07:30:00', NULL, 'Active'),
(3, 2, '2026-10-25 08:00:00', '2026-10-25 10:30:00', 'Completed');


INSERT INTO Payments (session_id, amount_due, amount_paid, method, status) VALUES
(2, 50.00, 50.00, 'Digital Wallet', 'Paid');


INSERT INTO Audit_Logs (user_id, action_type, description, ip_address) VALUES
(1, 'SYSTEM_INIT', 'Initialized base pricing and zones.', '192.168.1.100'),
(2, 'MANUAL_OVERRIDE', 'Marked spot VIP-01 for maintenance.', '192.168.1.101');