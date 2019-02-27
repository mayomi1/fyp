/**
 * Created by mayomi on 2/16/19 by 3:27 PM.
 */
const ProductModel = require('../models/product');
const UserModel = require('../models/user');


exports.selectLikeCategory = async (req, res) => {
	const product = await ProductModel.find({}).distinct('category');
	console.log('product ', product);
	res.render('select-category', {productCategory: product, user: req.session.user})
};

exports.submitLikeCategory = async (req, res) => {
	const {checkedCategory, userId} = req.body;

	console.log('users ', userId);
	if (userId) {
		try {
			const userResult = await UserModel.findById(userId);
			userResult.liked_category = checkedCategory;
			const savedUser = userResult.save();
			if (savedUser) {
				return res.redirect('/select-product')
			}
		} catch (e) {
			req.flash('message', 'something went wrong');
			return res.redirect('back');
		}

	}
};



exports.selectLike = async (req, res) => {
	const {user} = req.session;
	if(user) {
		try {
			const userDetails = await UserModel.findById(user._id);
			const userLikeCategory = userDetails.liked_category;

			let categoryResult = [];

			// loop through which of the users like
			// I used for of here because foreach doesn't work with async
			for (const liked of userLikeCategory) {
				const result = await ProductModel.find({category: liked});

				// each of the results of the category returns different array
				// so we need to remove the array and put them inside a single array
				for (let i = 0; i < result.length; i++) {
					categoryResult.push(result[i])
				}
			}
			res.render('select-products', {categoryResult: categoryResult, user: req.session.user});


		}catch (e) {
			console.log('e 2 ', e)
		}
	} else {
		return res.redirect('/login');
	}

};

exports.selectLikeProduct = async (req, res) => {
	const {selected_products} = req.body;
	const user = req.session.user;

	try{
		console.log('product ', selected_products);
		const currentUser = await UserModel.findById(user._id);
		currentUser.liked_product = selected_products;
		console.log('saved ,' ,currentUser.save());
		return res.redirect('/');
	} catch (e) {
		req.flash('message', 'Something went wrong, please try again');
		return res.redirect('back');
	}

};
