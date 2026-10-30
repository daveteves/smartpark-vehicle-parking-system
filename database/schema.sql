CREATE DATABASE IF NOT EXISTS smartpark_db;
USE smartpark_db;

--1. Teves, Dave Bryan A
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

--2. Teves, Richie
CREATE TABLE Tariff_Rules (
    tariff_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type ENUM('Car', 'Motorcycle', 'EV') NOT NULL,
    base_rate DECIMAL(10, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    daily_max DECIMAL(10, 2) NOT NULL,
    grace_period INT NOT NULL
);

CREATE TABLE Promo_Codes (
    promo_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2),
    discount_amount DECIMAL(10, 2),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_limit INT DEFAULT 1,
    times_used INT DEFAULT 0
);

CREATE TABLE Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('Car', 'Motorcycle', 'EV') NOT NULL,
    color VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

--5. Tero, Ma. Rudylin
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

