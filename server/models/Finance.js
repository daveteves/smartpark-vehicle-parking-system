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
            p.payment_id,
            p.charging_session_id,
            p.violation_id,
            p.amount AS payment_amount,
            p.payment_method,
            p.payment_status,
            p.payment_date,
            v.violation_type,
            v.fine_amount,
            v.violation_status,
            cs.entry_time,
            cs.exit_time,
            cs.total_amount AS session_amount
        FROM payments p
        LEFT JOIN violations v
            ON p.violation_id = v.violation_id
        LEFT JOIN charging_sessions cs
            ON p.charging_session_id = cs.charging_session_id

        UNION

        SELECT
            p.payment_id,
            p.charging_session_id,
            v.violation_id,
            p.amount AS payment_amount,
            p.payment_method,
            p.payment_status,
            p.payment_date,
            v.violation_type,
            v.fine_amount,
            v.violation_status,
            cs.entry_time,
            cs.exit_time,
            cs.total_amount AS session_amount
        FROM violations v
        LEFT JOIN payments p
            ON v.violation_id = p.violation_id
        LEFT JOIN charging_sessions cs
            ON v.charging_session_id = cs.charging_session_id
        WHERE p.payment_id IS NULL
    `);

    return rows;
};