/**
 * Created by mayomi on 3/27/19 by 2:46 AM.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//= ===============================
// Recommend Schema
//= ===============================
const RecommendSchema = new Schema({
		product_id: {
			type: String,
		},
		user_id: {
			type: String,
		},
		like: Boolean
	},
	{
		timestamps: true
	});
RecommendSchema.index({'$**': 'text'});

module.exports = mongoose.model('recommend', RecommendSchema);
