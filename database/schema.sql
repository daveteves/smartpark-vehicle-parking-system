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