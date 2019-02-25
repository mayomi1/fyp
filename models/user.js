/**
 * Created by mayomi on 2/12/19 by 11:46 PM.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true
		},
		full_name: String,
		phone_number: String,
		password: {
			type: String,
			required: true
		},
		liked_category: [],
		liked_product: [],
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date }
	},
	{
		timestamps: true
	});

module.exports = mongoose.model('user', UserSchema);
