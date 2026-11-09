const db = require("../config/db");

// PAYMENTS
exports.getPayments = async () => {
    const [rows] = await db.query(`
        SELECT * FROM payments
        ORDER BY payment_id DESC
    `);
    return rows;
};

exports.getPaymentById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM payments WHERE payment_id = ?", [id]
    );
    return rows[0];
};

exports.createPayment = async (data) => {
    const [result] = await db.query(`
        INSERT INTO payments
        (charging_session_id, violation_id, amount, payment_method, payment_status)
        VALUES (?, ?, ?, ?, ?)
    `, [
        data.charging_session_id || null,
        data.violation_id || null,
        data.amount,
        data.payment_method,
        data.payment_status || "Pending"
    ]);

    return result.insertId;
};

exports.updatePayment = async (id, data) => {
    const [result] = await db.query(`
        UPDATE payments
        SET amount = ?, payment_method = ?, payment_status = ?
        WHERE payment_id = ?
    `, [
        data.amount,
        data.payment_method,
        data.payment_status,
        id
    ]);

    return result.affectedRows;
};

exports.deletePayment = async (id) => {
    const [result] = await db.query(
        "DELETE FROM payments WHERE payment_id = ?", [id]
    );
    return result.affectedRows;
};

// VIOLATIONS
exports.getViolations = async () => {
    const [rows] = await db.query(`
        SELECT * FROM violations
        ORDER BY violation_id DESC
    `);
    return rows;
};

exports.createViolation = async (data) => {
    const [result] = await db.query(`
        INSERT INTO violations
        (charging_session_id, violation_type, description, fine_amount, violation_status)
        VALUES (?, ?, ?, ?, ?)
    `, [
        data.charging_session_id || null,
        data.violation_type,
        data.description || null,
        data.fine_amount,
        data.violation_status || "Unpaid"
    ]);

    return result.insertId;
};

exports.updateViolation = async (id, data) => {
    const [result] = await db.query(`
        UPDATE violations
        SET violation_type = ?, description = ?,
            fine_amount = ?, violation_status = ?
        WHERE violation_id = ?
    `, [
        data.violation_type,
        data.description || null,
        data.fine_amount,
        data.violation_status,
        id
    ]);

    return result.affectedRows;
};

exports.deleteViolation = async (id) => {
    const [result] = await db.query(
        "DELETE FROM violations WHERE violation_id = ?", [id]
    );
    return result.affectedRows;
};

// CHARGING SESSIONS
exports.getChargingSessions = async () => {
    const [rows] = await db.query(`
        SELECT * FROM charging_sessions
        ORDER BY charging_session_id DESC
    `);
    return rows;
};

// FULL OUTER JOIN REPORT
exports.getFinanceReport = async () => {
    const [rows] = await db.query(`
        SELECT 
            p.payment_id, p.session_id, p.amount_paid AS payment_amount, p.method AS payment_method, p.status AS payment_status, p.timestamp AS payment_date,
            v.violation_id, v.violation_type, v.fine_amount, v.status AS violation_status,
            cs.charging_id, cs.start_time AS charging_start, cs.cost AS charging_cost
        FROM Payments p
        LEFT JOIN Violations v ON p.session_id = v.session_id
        LEFT JOIN Charging_Sessions cs ON p.session_id = cs.session_id

        UNION

        SELECT 
            p.payment_id, v.session_id, p.amount_paid AS payment_amount, p.method AS payment_method, p.status AS payment_status, p.timestamp AS payment_date,
            v.violation_id, v.violation_type, v.fine_amount, v.status AS violation_status,
            cs.charging_id, cs.start_time AS charging_start, cs.cost AS charging_cost
        FROM Violations v
        LEFT JOIN Payments p ON v.session_id = p.session_id
        LEFT JOIN Charging_Sessions cs ON v.session_id = cs.session_id
        WHERE p.payment_id IS NULL
    `);

    return rows;
};