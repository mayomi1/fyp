/**
 * Created by mayomi on 2/12/19 by 11:50 PM.
 */
const CONSTANT = require('./config').constants;
/**
 * return unknown error
 * @param res
 * @param err
 * @returns {*}
 */
exports.unknownError = (res, err) => {
	return res.json({
		status: false,
		message: CONSTANT.unknownError,
		error: err.stack,
		data : null
	})
};

/**
 * Return a known Error
 * @param res
 * @param message
 * @returns {*}
 */
exports.knownError = (res, message) => {
	return res.json({
		status: false,
		message: message,
		data : null
	})
};

/**
 * return a success response
 * @param res
 * @param message
 * @param data
 * @returns {*}
 */
exports.successResponse = (res, message, data) => {
	return res.json({
		status: true,
		message: message,
		data: data,
	})
};

