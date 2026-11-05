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

-- 2. First Level Dependencies
INSERT INTO Tariff_Rules (vehicle_type, base_rate, hourly_rate, daily_max, grace_period) VALUES
('Car', 50.00, 20.00, 300.00, 15),
('Motorcycle', 30.00, 10.00, 150.00, 15),
('EV', 40.00, 15.00, 250.00, 20);

INSERT INTO Promo_Codes (code, discount_percentage, discount_amount, valid_from, valid_until, usage_limit) VALUES
('WELCOME20', 20.00, NULL, '2026-11-01', '2026-12-31', 100),
('MINUS50', NULL, 50.00, '2026-11-01', '2026-11-30', 50);

INSERT INTO Vehicles (user_id, license_plate, vehicle_type, color) VALUES
(2, 'ABC-1234', 'Car', 'Black'),
(3, 'XYZ-9876', 'EV', 'White'),
(2, 'MOT-555', 'Motorcycle', 'Red');

INSERT INTO Memberships (user_id, plan_type, start_date, end_date, status) VALUES
(2, 'Monthly', '2026-11-01', '2026-12-01', 'Active');

INSERT INTO Audit_Logs (user_id, action_type, description, ip_address) VALUES
(1, 'SYSTEM_START', 'System initialized by admin', '192.168.1.100'),
(2, 'USER_LOGIN', 'Customer logged in', '10.0.0.50');

INSERT INTO Parking_Spots (zone_id, spot_number, status) VALUES
(1, 'A1', 'Available'),
(1, 'A2', 'Occupied'),
(2, 'EV1', 'Occupied'),
(2, 'EV2', 'Available');

INSERT INTO IoT_Devices (zone_id, device_type, ip_address, status) VALUES
(1, 'Boom Barrier', '192.168.1.10', 'Online'),
(2, 'Camera', '192.168.1.11', 'Online');

-- 3. Second-Level Dependencies
INSERT INTO RFID_Tags (vehicle_id, rfid_code, issue_date) VALUES
(1, 'RFID-CAR-001', '2026-11-01'),
(2, 'RFID-EV-002', '2026-11-01');

INSERT INTO EV_Chargers (spot_id, charger_type, power_output_kw, status) VALUES
(3, 'Level 2', 7.20, 'In Use'),
(4, 'DC Fast', 50.00, 'Available');

-- 4. Third-Level Dependencies
INSERT INTO Reservations (user_id, spot_id, start_time, end_time, status) VALUES
(2, 1, '2026-11-02 08:00:00', '2026-11-02 12:00:00', 'Pending');

INSERT INTO Parking_Sessions (vehicle_id, spot_id, entry_timestamp, exit_timestamp, status) VALUES
(1, 2, '2026-11-01 07:30:00', NULL, 'Active'),
(2, 3, '2026-11-01 08:15:00', NULL, 'Active');


-- 5. Fourth-Level Dependencies
INSERT INTO Payments (session_id, amount_due, amount_paid, method, status) VALUES
(1, 70.00, 0.00, 'Card', 'Pending');

INSERT INTO Violations (vehicle_id, session_id, violation_type, fine_amount, status) VALUES
(1, 1, 'Overstaying Grace Period', 100.00, 'Unpaid');

INSERT INTO Charging_Sessions (session_id, charger_id, start_time, end_time, energy_consumed_kwh, cost) VALUES
(2, 1, '2026-11-01 08:20:00', NULL, 15.50, 125.00);
