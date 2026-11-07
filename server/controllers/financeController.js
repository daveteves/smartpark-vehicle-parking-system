const Finance = require("../models/Finance");

const response = (res, status, success, message, data = null) => {
    return res.status(status).json({
        success,
        message,
        data
    });
};

const validId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const validAmount = (amount) =>
    amount !== undefined &&
    amount !== null &&
    amount !== "" &&
    Number.isFinite(Number(amount)) &&
    Number(amount) >= 0;

// PAYMENTS CRUD
exports.getPayments = async (req, res) => {
    try {
        const data = await Finance.getPayments();
        response(res, 200, true, "Payments retrieved", data);
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        if (!validId(req.params.id))
            return response(res, 400, false, "Invalid payment ID");

        const data = await Finance.getPaymentById(req.params.id);

        if (!data)
            return response(res, 404, false, "Payment not found");

        response(res, 200, true, "Payment retrieved", data);
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { amount, payment_method } = req.body;

        if (!validAmount(amount) || !payment_method ||
            typeof payment_method !== "string")
            return response(res, 400, false, "Invalid payment input");

        const id = await Finance.createPayment({
            ...req.body,
            amount: Number(amount),
            payment_method: payment_method.trim()
        });

        response(res, 201, true, "Payment created", { payment_id: id });
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.updatePayment = async (req, res) => {
    try {
        if (!validId(req.params.id))
            return response(res, 400, false, "Invalid payment ID");

        const { amount, payment_method, payment_status } = req.body;

        if (!validAmount(amount) || !payment_method || !payment_status)
            return response(res, 400, false, "Invalid payment input");

        const result = await Finance.updatePayment(req.params.id, {
            amount: Number(amount),
            payment_method,
            payment_status
        });

        if (!result)
            return response(res, 404, false, "Payment not found");

        response(res, 200, true, "Payment updated");
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.deletePayment = async (req, res) => {
    try {
        if (!validId(req.params.id))
            return response(res, 400, false, "Invalid payment ID");

        const result = await Finance.deletePayment(req.params.id);

        if (!result)
            return response(res, 404, false, "Payment not found");

        response(res, 200, true, "Payment deleted");
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

// VIOLATIONS CRUD
exports.getViolations = async (req, res) => {
    try {
        const data = await Finance.getViolations();
        response(res, 200, true, "Violations retrieved", data);
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.createViolation = async (req, res) => {
    try {
        const { violation_type, fine_amount } = req.body;

        if (!violation_type || typeof violation_type !== "string" ||
            !validAmount(fine_amount))
            return response(res, 400, false, "Invalid violation input");

        const id = await Finance.createViolation({
            ...req.body,
            violation_type: violation_type.trim(),
            fine_amount: Number(fine_amount)
        });

        response(res, 201, true, "Violation created", { violation_id: id });
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.updateViolation = async (req, res) => {
    try {
        if (!validId(req.params.id))
            return response(res, 400, false, "Invalid violation ID");

        const { violation_type, fine_amount, violation_status } = req.body;

        if (!violation_type || !validAmount(fine_amount) || !violation_status)
            return response(res, 400, false, "Invalid violation input");

        const result = await Finance.updateViolation(req.params.id, {
            ...req.body,
            violation_type,
            fine_amount: Number(fine_amount),
            violation_status
        });

        if (!result)
            return response(res, 404, false, "Violation not found");

        response(res, 200, true, "Violation updated");
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

exports.deleteViolation = async (req, res) => {
    try {
        if (!validId(req.params.id))
            return response(res, 400, false, "Invalid violation ID");

        const result = await Finance.deleteViolation(req.params.id);

        if (!result)
            return response(res, 404, false, "Violation not found");

        response(res, 200, true, "Violation deleted");
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

// CHARGING SESSIONS CRUD
exports.getChargingSessions = async (req, res) => {
    try {
        const data = await Finance.getChargingSessions();
        response(res, 200, true, "Charging sessions retrieved", data);
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};

// JOIN REPORT
exports.getFinanceReport = async (req, res) => {
    try {
        const data = await Finance.getFinanceReport();
        response(res, 200, true, "Finance report retrieved", data);
    } catch (error) {
        response(res, 500, false, "Server error");
    }
};