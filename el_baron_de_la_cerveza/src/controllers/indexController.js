const db = require('../database/models');
const { Op } = require('sequelize');
const nodemailerTransporter = require('../functions/nodemailerTransporter');
let axios = require('axios')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


module.exports = {
	index: (req, res) => {
        if(req.session.user){
            let user = req.session.user
            axios({
            method: 'get',
            url: `http://localhost:3030/api/cart/${user.id}`,
            })
            .then(response =>{
                let cart = response.data.data?.order_items.map(item => {
                    return {
                    ...item.products,
                    quantity: item.quantity
                    }
                })
                db.Product.findAll({
                    include: [{
                        association: "category"
                    },{
                        association: "brand"
                    }]
                })
                .then(product => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1 
                        },
                    }) 
                    .then(products => {
                        db.Brand.findAll()
                        .then(brands =>{
                            res.render("index", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                brands,
                                cart,
                                destacadosSlider: products,
                                session: req.session
                            })
                        })
                    })
                })
            })
        } else {
            db.Product.findAll({
                include: [{
                    association: "category"
                },{
                    association: "brand"
                }]
            })
            .then(product => {
                db.Product.findAll({
                    include: [{
                        association: "brand"
                    }],
                    where: {
                        outstanding: 1 
                    },
                }) 
                .then(products => {
                    db.Brand.findAll()
                    .then(brands =>{
                        res.render("index", {
                            titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                            titleSlider: "Destacados",
                            product,
                            brands,
                            destacadosSlider: products,
                            session: req.session
                        })
                    })
                })
            })
        }
    },
	about: (req, res) => {
        if(req.session.user){
            let user = req.session.user
            axios({
            method: 'get',
            url: `http://localhost:3030/api/cart/${user.id}`,
            })
            .then((response)=>{
                let cart = response.data.data?.order_items.map(item => {
                    return {
                    ...item.products,
                    quantity: item.quantity
                    }
                })
                res.render("about", {
                    titleBanner: "Acerca de Nosotros",
                    cart,
                    session: req.session
                })

            })
        } else {
            res.render("about", {
                titleBanner: "Acerca de Nosotros",
                session: req.session
            })
        }
    },
    contact: (req, res) => {
        if(req.session.user){
            let user = req.session.user
            axios({
            method: 'get',
            url: `http://localhost:3030/api/cart/${user.id}`,
            })
            .then((response)=>{
                let cart = response.data.data?.order_items.map(item => {
                    return {
                    ...item.products,
                    quantity: item.quantity
                    }
                })
                res.render("contact", {
                    titleBanner: "Contáctenos",
                    cart,
                    session: req.session
                })

            })
        } else {
            res.render("contact", {
                titleBanner: "Contáctenos",
                session: req.session
            })
        }
    },
    finalizePurchase: (req, res) => {
        if(req.session.user){
            let user = req.session.user
            axios({
            method: 'get',
            url: `http://localhost:3030/api/cart/${user.id}`,
            })
            .then(response => {
                let cart = response.data.data?.order_items.map(item => {
                    return {
                    ...item.products,
                    quantity: item.quantity
                    }
                })
                db.Product.findOne({
                    where: {
                        id: req.params.id
                    },
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ]
                })
                .then(productDetail => {
                    db.Product.findByPk(req.params.id)
                    .then(product => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
                        let bannerPromise = db.Banner.findAll()
        
                        Promise.all([categoryPromise, brandPromise, bannerPromise])
                        .then(([categories, brands, banners]) => {
                            res.render("finalizePurchase", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                productDetail,
                                categories,
                                banners,
                                brands,
                                cart,
                                product,
                                session: req.session
                            })
                        })
                    })
                })
            })
        } else {
            db.Product.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    {association: "category"},
                    {association: "brand"}
                ]
            })
            .then(productDetail => {
                db.Product.findByPk(req.params.id)
                .then(product => {
                    let categoryPromise = db.Category.findAll()
                    let brandPromise = db.Brand.findAll()
                    let bannerPromise = db.Banner.findAll()
    
                    Promise.all([categoryPromise, brandPromise, bannerPromise])
                    .then(([categories, brands, banners]) => {
                        res.render("finalizePurchase", {
                            titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                            productDetail,
                            categories,
                            banners,
                            brands,
                            product,
                            session: req.session
                        })
                    })
                })
            })
        }

    },
	search: (req, res) => {
        if(req.session.user){
            let user = req.session.user
            axios({
            method: 'get',
            url: `http://localhost:3030/api/cart/${user.id}`,
            })
            .then(response => {
                let cart = response.data.data?.order_items.map(item => {
                    return {
                    ...item.products,
                    quantity: item.quantity
                    }
                })
                db.Product.findAll({
                    include: [{
                        association: "category"
                    },{
                        association: "brand"
                    }],
                    where: {
                        name: {
                            [Op.like] : `%${req.query.keywords}%`
                        }
                    }
                })
                .then(result => {
                    res.render('results', {
                        titleBanner: "Resultados de la busqueda",
                        result: result,
                        toThousand,
                        cart,
                        search: req.query.keywords,
                        session: req.session
                    })
                })
            })
        } else {
            db.Product.findAll({
                include: [{
                    association: "category"
                },{
                    association: "brand"
                }],
                where: {
                    name: {
                        [Op.like] : `%${req.query.keywords}%`
                    }
                }
            })
            .then(result => {
                res.render('results', {
                    titleBanner: "Resultados de la busqueda",
                    result: result,
                    toThousand,
                    search: req.query.keywords,
                    session: req.session
                })
            })
        }
	},
    formEmail: function(req, res){
        let consultaDeUsuario = {
            email : req.body.email,
            name : req.body.name,
            msg : req.body.msg,
            asunto: req.body.asunto
        }
        
        let mailOptions = {
            from: 'Baron de la cerveza <yon.palac@gmail.com>',
            to: 'yon.palac@gmail.com',
            subject: `${consultaDeUsuario.name} te ha enviado una consulta`,
            html: 
            ` <div class="header" style="width:100%;background-color: #fff;padding: 5px;">
            
            <div class="img" style="width: 30%;min-width: 140px;max-width: 270px;margin:0 auto">
            <img src="" alt="" style="width: 100%;">
            </div>
            </div>
            <div class="body" style="max-width: 700px;margin: 0 auto;">
            <p>${consultaDeUsuario.name} quiere contactarse con nosotros</p>
            <p>
            Su correo electronico es: ${consultaDeUsuario.email}
            </p>
            <p>
            Su asunto es: ${consultaDeUsuario.asunto}
            </p>
            <p>
            Nos ha enviado la siguiente consulta: ${consultaDeUsuario.msg} 
            </p>
            </div>
            
            </div>`
        }
        
        nodemailerTransporter.sendMail(mailOptions, (err, data) => {
            
            console.log('email enviado')
            res.redirect('/')
            
        });
    }
}