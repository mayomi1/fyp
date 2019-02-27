var express = require('express');
var router = express.Router();
const Auth = require('../controller/auth');
const ProductController  = require('../controller/product');
const SelectController = require('../controller/select-like');
const multer = require('multer');

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
});

let upload = multer({storage: storage});

/* GET home page. */
router.get('/', ProductController.products);


router.get('/shop', function(req, res, next) {
	res.render('shop', { title: 'Shop' });
});

router.get('/upload_product', function(req, res, next) {
	res.render('upload-product', {
		title: 'Upload Prdocut',
		user: req.session.user,
		message: req.flash('message')
	});
});

router.post('/upload_product', upload.single('product_image'), ProductController.upload_product);

router.get('/image/:image', ProductController.getImageUrl);

router.get('/single', ProductController.product);

router.get('/about', function(req, res, next) {
	res.render('about', { title: 'Shop', user: req.session.user  });
});

router.get('/contact', function(req, res, next) {
	res.render('contact', { title: 'Shop' });
});

router.get('/register', function(req, res, next) {
	res.render('register', {
		title: 'Shop',
		message: req.flash('message'),
		user: req.session.user
	});
});
router.post('/register', Auth.registerUser);

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Shop',
		message: req.flash('message'),
		user: req.session.user
	});
});
router.post('/login', Auth.loginUser);
router.post('/logout', Auth.logout);


router.get('/checkout', function(req, res, next) {
	res.render('checkout', {
		title: 'Shop',
		message: req.flash('message'),
		user: req.session.user });
});

router.get('/payment', function(req, res, next) {
	res.render('payment', {
		title: 'Shop',
		message: req.flash('message'),
		user: req.session.user });
});

router.get('/select-category', SelectController.selectLikeCategory);
router.post('/select-category', SelectController.submitLikeCategory);
router.post('/select-product', SelectController.selectLikeProduct);
router.get('/select-product', SelectController.selectLike);

module.exports = router;
