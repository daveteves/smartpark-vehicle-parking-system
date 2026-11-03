USE smartpark_db;

-- 1. Base Tables (No Foreign Keys)
INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES
('Admin', 'User', 'admin@smartpark.com', 'hash_admin_123', 'Admin'),
('Dave', 'Teves', 'dave.t@email.com', 'hash_dave_456', 'Customer'),
('Rudylin', 'Tero', 'rudylin.t@email.com', 'hash_rudy_789', 'Customer');

INSERT INTO Parking_Zones (zone_name, floor_level, capacity, zone_type) VALUES
('Level 1 North', 1, 50, 'Standard'),
('Level 1 South', 1, 20, 'EV'),
('Level 2 VIP', 2, 30, 'VIP');

-- 5. Fourth-Level Dependencies
INSERT INTO Payments (session_id, amount_due, amount_paid, method, status) VALUES
(1, 70.00, 0.00, 'Card', 'Pending');

INSERT INTO Violations (vehicle_id, session_id, violation_type, fine_amount, status) VALUES
(1, 1, 'Overstaying Grace Period', 100.00, 'Unpaid');

INSERT INTO Charging_Sessions (session_id, charger_id, start_time, end_time, energy_consumed_kwh, cost) VALUES
(2, 1, '2026-11-01 08:20:00', NULL, 15.50, 125.00);