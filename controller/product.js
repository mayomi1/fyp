/**
 * Created by mayomi on 2/14/19 by 3:35 PM.
 */
const ProductModel = require('../models/product');
const UserModel = require('../models/user');
const RecommendModel = require('../models/recommend');
const path = require('path');
const config = require('../config');
const raccoon = require('raccoon');

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

	try {
		const allProduct = await ProductModel.find({});

		// recommendation
		let categoryResult = [];
		const user = req.session.user;
		if(user) {
			const currentUser = await UserModel.findById(user._id).limit(5);
			for(const category of currentUser.liked_category) {
				const result = await ProductModel.find({category: category});
				for (let i = 0; i < result.length; i++) {
					categoryResult.push(result[i])
				}
			}
		}

		res.render('index', {
			recommendation: categoryResult,
			products: allProduct,
			user: req.session.user,
			message: req.flash('message')
		})

	} catch (e) {
		console.log(e)
	}




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

exports.like = (req, res) => {
	const {sku} = req.params;
	console.log('sku ',sku)
	try {
		raccoon.liked(sku, 'productId').then(() => {
			RecommendModel({
				product_id: sku,
				like: true
			}).save();
			ProductModel.findById(sku).then((result) => {
				result.like = true;
				result.save();
				return res.send(result);
			})
		})

	}catch (e) {}
};

exports.unlike =  (req, res) => {
	const {sku} = req.params;
	console.log('sku ',sku)
	try {
		raccoon.unliked(sku, 'productId').then(() => {
			RecommendModel({
				product_id: sku,
				like: false
			}).save();
			ProductModel.findById(sku).then((result) => {
				result.like = false;
				result.save();
				return res.send(result);
			})
		})


	}catch (e) {}
};

exports.getProductBySearch = async (req, res) => {
	if (req.query.search) {
		let searchString = req.query.search;
		searchString = searchString.toLowerCase();


		try {
			const searchItem = await ProductModel.find({$text: {$search: searchString}});
			console.log('search ', searchItem);
			RecommendModel({
				product_id: searchItem[0]._id,
				like: true
			}).save();

			// recommendation
			const rec = await ProductModel.find({category: searchItem[0].category}).limit(4);

			console.log('rec' ,rec);

			res.render('index', {
				recommendation: rec,
				products: searchItem,
				user: req.session.user,
				message: req.flash('message')
			})
		} catch (e) {
			console('wrong search ', e)
		}
	}
}

exports.test = (req, res) => {
	raccoon.recommendFor('productId', '1').then((results) => {
		res.send(results);
	});
}
