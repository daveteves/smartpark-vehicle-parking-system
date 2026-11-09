## project-overview.md

# 1.Introduction
SmartPark is a vehicle parking management system designed to help manage parking spaces, vehicle information, reservations, parking sessions, and payment records. The system aims to organize parking operations and help prevent conflict between reservations and actual parking sessions.
# 2.Project Objectives
-Organize vehicle and parking space information.
-Manage parking reservations and parking sessions.
-Detect conflicts between reservations and actual parking sessions.
-Handle no-show reservations according to the system's rules.
-Calculate parking fees based on the applicable tariff rules.
-Maintain records of payment transactions and parking activities.
# 3.Target users
-Admin
-Operator
-Customer
# 4.Main Features
-User Management
-Vehicle Management
-Parking Space Management
-Reservation Management
-Conflict Detection
-No-show Handling
-Parking fee Calculation
-Payment Records
-Audit Logs
-Reports
# 5.Project Scope 
Include in the Project
-A web-based interface with Admin, Operator, and Customer roles.
-A REST API using NODE.js and Express.js.
-MySQL Database for storing system information.
-Simulated vehicle entry and exit through the Operator interface.
-Reservation conflict detection and parking fee calculation.
-Parking and reservation reports.

Excluded in the Project
-Physical parking gate hardware integration.
-RFID Hardware integration.
-Stripe payment integration.

## system-architecture.md

# 1.Architecture Overview
Smartpark follows a three-tier architecture consist of Client tier, Application tier, and Data tier. Each tier has a specific responsibility and communicates with the other tier to support the parking management system.
# 2.Client Tier
Is the web-based user interface of SmartPark. It provides screens and functions for the Admin, Operator, and Customer. Users interact with the frontend to manage vehicles, parking spaces, reservations, parking sessions, and other system activities. The client sends request to the backend REST API and display the responses and received from the application tier.
# 3.Application Tier
Is responsible for processing requests and implementing the business logic of Smartpark. It uses Node.js and Express.js to provide REST API services. The backend user requests, validates information, applies system rules, and communicates with the database when data is needed.

Main responsibilities include:
-Processing API requests.
-Managing parking reservations.
-Checking reservation conflicts.
-Handling parking sessions.
-Calculating parking fees.
-Managing payment and audit records.
-Providing data for reports.
# 4.Data Tier
The Data Tier uses MySQL to store and manage SmartPark information. The database contains tables for users, vehicles, RFID tags, parking zones, parking spots, tariff rules, reservations, parking sessions, payments, and audit logs. The database maintains relationships between records using primary keys and foreign keys. It also supports data consistency through database constraints.
# 5.System Request Flow
-The user performs an action in the web interface.
-The frontend sends a request to the REST API.
-The backend processes the request.
-The backend validates the information and implies the appropriate business rules.
-The backend communicates with MySQL when database access is needed.
-The returns the requested information or confirms the operation.
-The backend sends API a response to the frontend.
-The frontend displays the result to the user.
# 6.Backend Folder Organization
The backend follows a structure to separate application responsibilities.
-config: Contains configuration files, including database connection settings.
-routes: Defines API routes and connects them to controllers.
-controllers: Handles incoming requests and prepares responses.
-models: Contains database-related operations and data handling.
-services: Contains business logic and system processes.
-middlewares: Handles shared request processing such as violation or authentication, when implemented.
-utility: Contains reusable helper functions.

## database-design.md

# 1.Database Overview
SmartPark uses MySQL as its relational database management system. The database stores information about users, vehicles, parking spaces, reservations, parking sessions, payments, and system activities. The database is designed to maintain relationships between records and support the main operations of the parkingmanagement system.
# 2.Database Tables
-Users: User accounts and roles.
-Vehicles: Registered vehicle information
-RFID_Tags: RFID tag records
-Parking_Zones: Parking zone information.
-Parking_Spots: Individual parking spaces.
-Tariff_Rules: Parking fees.
-Reservations: Reservation information.
-Parking_Sessions: Actual parking sessions.
-Payments: payment records.
-Audit_Logs: Record of system activities.
-Violations: Record of violations and penalties.
-Charging_Sessions: Vehicle activities.
# 3.Primary Keys
Uniquely identify each record in database table. Entities in SmartPark has its own primary key.
# 4.Foreign Keys
Establish relationships between tables and help maintain referential integrity.
# 5.Database Constraints
Help maintain data consistency and prevent invalid records.
# 6.Entity Relationship Diagram (ERD)
Illustrates the relationships among the sixteen Smartpark database tables. It shows how users, vehicles, RFID tags, parking zones, parking zones, parking spots, tariff rules, reservations, parking sessions, payments, and audit logs are connected. ERD serves as visual reference for understanding the database structure and relationships.
# 7.Important Database Rules
-Each database record must have a unique primary key.
-Foreign key must reference valid related records.
-Reservations must reference valid vehicles and parking spots.
-Parking sessions must reference valid parking information.
-Reservation conflicts must be checked before confirming a reservation.
-Adjacent reservation time periods are allowed when one reservation ends exactly when another begins.
-Parking fees must follow the applicable tariff rules.
-Payment records must be connected to valid parking transactions.
-Important system activities should be record in audit logs when applicable.

## api_endpoints.md

# 1.Introduction
SmartPark uses a REST API developed with NODE.js and Express.js to connect the frontend and backend application. The API allows the frontend to request information, create records, and update information.
# 2.Authentication endpoints
Responsible for handling user login and access to the system.
# 3.User Endpoints
Manage user account information.
# 4.Vehicle Endpoints
Manage registered vehicle information.
# 5.Parking Endpoints
Manage parking zones and parking spots.
# 6.Reservation Endpoints
Handle parking reservation operations.
# 7.Parking Session Endpoints
Handle parking activities.
##Payment Endpoints
Manage parking records.
# 8.Report Endpoints
Provide information for monitoring parking operations.
# 9.Error Endpoints
The API should return appropriate codes and error messages when processing requests.

