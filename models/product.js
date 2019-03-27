/**
 * Created by mayomi on 2/14/19 by 3:43 PM.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//= ===============================
// Product Schema
//= ===============================
const ProductSchema = new Schema({
		product_name: {
			type: String,
		},
		description: String,
		product_image: String,
		price: String,
		category: String,
		like: Boolean
	},
	{
		timestamps: true
	});
ProductSchema.index({'$**': 'text'});

module.exports = mongoose.model('product', ProductSchema);
