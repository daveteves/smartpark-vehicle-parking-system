USE smartpark_db;

-- 1. Base Tables (No Foreign Keys)
INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES
('Admin', 'User', 'admin@smartpark.com', 'hash_admin_123', 'Admin'),
('Dave', 'Teves', 'dave@email.com', 'hash_dave_456', 'Customer'),
('Rudylyn', 'Tero', 'rudylyn.t@email.com', 'hash_rudy_789', 'Customer');

INSERT INTO Parking_Zones (zone_name, floor_level, capacity, zone_type) VALUES
('Level 1 North', 1, 50, 'Standard'),
('Level 1 South', 1, 20, 'EV'),
('Level 2 VIP', 2, 30, 'VIP');

-- 2. MasterData Seeds
INSERT INTO Tariff_Rules (vehicle_type, base_rate, hourly_rate, daily_max, grace_period) VALUES
('Car', 30.00, 20.00, 300.00, 15),
('Motorcycle', 20.00, 10.00, 150.00, 10),
('EV', 40.00, 25.00, 350.00, 20);

INSERT INTO Promo_Codes (code, discount_percentage, discount_amount, valid_from, valid_until, usage_limit, times_used) VALUES
('WELCOME10', 10.00, NULL, '2026-01-01', '2026-12-31', 100, 0),
('FLAT50', NULL, 50.00, '2026-06-01', '2026-06-30', 50, 0),
('STUDENT20', 20.00, NULL, '2026-01-01', '2026-12-31', 200, 0);

INSERT INTO Vehicles (user_id, license_plate, vehicle_type, color) VALUES
(2, 'ABC-1234', 'Car', 'Red'),
(2, 'XYZ-5678', 'Motorcycle', 'Black'),
(3, 'EV-9999', 'EV', 'White');

-- 5. Fourth-Level Dependencies
INSERT INTO Payments (session_id, amount_due, amount_paid, method, status) VALUES
(1, 70.00, 0.00, 'Card', 'Pending');

INSERT INTO Violations (vehicle_id, session_id, violation_type, fine_amount, status) VALUES
(1, 1, 'Overstaying Grace Period', 100.00, 'Unpaid');

INSERT INTO Charging_Sessions (session_id, charger_id, start_time, end_time, energy_consumed_kwh, cost) VALUES
(2, 1, '2026-11-01 08:20:00', NULL, 15.50, 125.00);
