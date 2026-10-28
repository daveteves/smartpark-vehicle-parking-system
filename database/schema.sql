CREATE DATABASE IF NOT EXISTS smartpak_db;
USE smartpak_db;

--1. Teves, Dave Bryan
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Operator', 'Customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Parking_Zones (
    zone_id INT AUTO_INCREMENT PRIMARY KEY,
    zone_name VARCHAR(50) NOT NULL,
    floor_level INT NOT NULL,
    capacity INT NOT NULL,
    zone_type ENUM('Standard', 'VIP', 'EV', 'Disabled') NOT NULL
);

--6. Bermudo Micha G.
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

CREATE TABLE Violations (
    violation_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    session_id INT,
    violation_type VARCHAR(100) NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Unpaid', 'Paid', 'Appealed') DEFAULT 'Unpaid',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES Parking_Sessions(session_id) ON DELETE SET NULL
);

CREATE TABLE Charging_Sessions (
    charging_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    charger_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    energy_consumed_kwh DECIMAL(8, 2) DEFAULT 0.00,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (session_id) REFERENCES Parking_Sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (charger_id) REFERENCES EV_Chargers(charger_id) ON DELETE CASCADE
);