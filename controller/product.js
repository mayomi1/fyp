/**
 * Created by mayomi on 2/14/19 by 3:35 PM.
 */
const ProductModel = require('../models/product');
const path = require('path');
const config = require('../config');

exports.upload_product = (req, res) => {

	const {product_name, description, price, category} = req.body;
	let image;

	if(req.file){
		image = req.file.originalname;
	}
	switch (true) {
		case !product_name:
			 req.flash('message', 'product name is required');
			 return res.redirect('back');
		case !category:
			req.flash('message', 'product name is required');
			return res.redirect('back');
		case !description:
			req.flash('message', 'description is required');
			return res.redirect('back');
		case !price:
			req.flash('message', 'price is required');
			return res.redirect('back');
		case !image:
			req.flash('message', 'product image is required');
			return res.redirect('back');
		default:
			'';
	}

	const newProduct = ProductModel({
		product_name: product_name,
		description: description,
		price: price,
		category: category,
		product_image: image,
	});
	newProduct.save()
		.then((product) => {
		res.redirect('/');
	}).catch(err=> {
		req.flash('message', 'Something went wrong, please try again');
		res.redirect('back');
	})
};

exports.getImageUrl = (req, res) => {
	let image = req.params.image;
	res.sendFile(path.join(__dirname,'../uploads', image),function(err){
		if(err){
			req.flash('message', 'Something went wrong. please try again');
		}
	})
};

exports.products = async (req, res) => {
	const allProduct = await ProductModel.find({});
	res.render('index', {
		products: allProduct,
		user: req.session.user,
		message: req.flash('message')
	})
};

exports.product = async (req, res) => {
	const {sku} = req.query;
	try {
		const result = await ProductModel.findById(sku);
		const rec = await ProductModel.find({category: result.category}).limit(4);
		res.render('single', {
			product: result,
			singleRec: rec,
			user: req.session.user
		})
	}catch (e) {}
};
