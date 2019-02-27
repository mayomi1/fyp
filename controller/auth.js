/**
 * Created by mayomi on 2/12/19 by 12:16 AM.
 */
const Helper = require('../helper');
const UserModel = require('../models/user');

exports.registerUser = (req, res) => {
	const {email, password, password2, phone, full_name} = req.body;
	switch (true) {
		case !email:
			 req.flash('message', 'email is required');
			 return res.redirect('back');
		case !password:
			 req.flash('message', 'password is required');
			return res.redirect('back');
		case !phone:
			req.flash('message', 'phone number is required');
			return res.redirect('back');
		case !full_name:
			req.flash('message', 'full name is required');
			return res.redirect('back');

		case password !== password2:
			 req.flash('message', 'Password does not match');
			return res.redirect('back');
		default:
			'';
	}
	const newUser = UserModel({
		email, password, phone, full_name
	});
	newUser.save()
		.then(user => {
			req.session.user = user;
			return res.redirect('/select-category');
		})
		.catch(error => {
			console.log('err', error);
			if (error.code = 'E11000') {
				if (error.message.indexOf('email') !== -1) {
					req.flash('message', 'Email is duplicated');
					return res.redirect('back');
				} else if (error.message.indexOf('phone') !== -1) {
					req.flash('message', 'Phone Number is duplicated');
					return res.redirect('back');				}
			}
			req.flash('message', 'Something went wrong, please try again');
			return res.redirect('back');
		})
};

exports.loginUser = (req, res) => {
	const {email, password} = req.body;

	switch (true) {
		case !email:
			req.flash('message', 'email is required');
			return res.redirect('back');
		case !password:
			req.flash('message', 'password is required');
			return res.redirect('back');
		default:
			''
	}

	if(email && password) {
		UserModel.findOne({email: email, password: password}).then(response => {
			req.session.user = response;
			res.redirect('/');
		}).catch( err=> {
			req.flash('message', 'User not found');
			res.redirect('back');
		})
	}
};

exports.logout = (req, res) => {
	return req.session.destroy(function(){
		res.redirect('/login');
	});
};
