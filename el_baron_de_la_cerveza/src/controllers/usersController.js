let { products, users } = require('../data/dataBase.js');
let { validationResult } = require('express-validator')
let bcrypt = require('bcryptjs')

const productCart = products.filter(element => element.cart === true)
		

module.exports = {
	user: (req, res) => {
		res.render('user', {
			titleBanner: "Configuración de frescura",
			productCart
		})
	},
	login: (req, res) => {
		res.render('login', {
			productCart,
			session: req.session
		});
	},
	processLogin: (req, res) => {
        let errors = validationResult(req)

        if (errors.isEmpty()) {
            let user = users.find(user => user.email === req.body.email)

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                rol: user.rol
            }  


            if(req.body.remember){
                res.cookie('elBaronDeLaCerveza', req.session.user, {expires: new Date(Date.now() + 900000), httpOnly : true})
            }
            
            res.locals.user = req.session.user

            res.redirect('/')
        }else{
            res.render('login', {
            	productCart,
                errors: errors.mapped(),
                session: req.session
            })
        }
    },
	register: (req, res) => {
		let productCart = products.filter(element => element.cart === true)
		res.render('register', {
			productCart
		});
	},
}