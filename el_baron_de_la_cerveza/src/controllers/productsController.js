const db = require('../database/models');
const { Op } = require('sequelize');
let axios = require('axios')

const BASE_URL = "http://localhost:3030/api";

module.exports = {
    // reenderizar vista de productos
    products: (req, res) => {
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
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ],
                })
                .then(product => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1 
                        }                
                    })
                    .then(products => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
                        let bannerPromise = db.Banner.findAll()
        
                        Promise.all([categoryPromise, brandPromise, bannerPromise])
                        .then(([categories, brands, banners]) => {
                            res.render("products", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                categories,
                                banners,
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
                include: [
                    {association: "category"},
                    {association: "brand"}
                ],
            })
            .then(product => {
                db.Product.findAll({
                    include: [{
                        association: "brand"
                    }],
                    where: {
                        outstanding: 1 
                    }                
                })
                .then(products => {
                    let categoryPromise = db.Category.findAll()
                    let brandPromise = db.Brand.findAll()
                    let bannerPromise = db.Banner.findAll()
    
                    Promise.all([categoryPromise, brandPromise, bannerPromise])
                    .then(([categories, brands, banners]) => {
                        res.render("products", {
                            titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                            titleSlider: "Destacados",
                            product,
                            categories,
                            banners,
                            brands,
                            destacadosSlider: products,
                            session: req.session
                        })
                    })
                })
            })

        }
    },
    // Detalles de producto
    detail: (req, res) => {
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
                    db.Product.findAll({
                        limit: 5,
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1 
                        }                
                    })
                    .then(product => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
                        let bannerPromise = db.Banner.findAll()
        
                        Promise.all([categoryPromise, brandPromise, bannerPromise])
                        .then(([categories, brands, banners]) => {
                            res.render("productDetail", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Recomendados",
                                productDetail,
                                categories,
                                banners,
                                brands,
                                product,
                                cart,
                                session: req.session,
                                user: req.session.user?.id || null,
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
                db.Product.findAll({
                    limit: 5,
                    include: [{
                        association: "brand"
                    }],
                    where: {
                        outstanding: 1 
                    }                
                })
                .then(product => {
                    let categoryPromise = db.Category.findAll()
                    let brandPromise = db.Brand.findAll()
                    let bannerPromise = db.Banner.findAll()
    
                    Promise.all([categoryPromise, brandPromise, bannerPromise])
                    .then(([categories, brands, banners]) => {
                        res.render("productDetail", {
                            titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                            titleSlider: "Recomendados",
                            productDetail,
                            categories,
                            banners,
                            brands,
                            product,
                            session: req.session,
                            user: req.session.user?.id || null,
                        })
                    })
                })
            })
        }
    },
    // Filtrar productos por categorias
    filter: (req, res) => {
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
                    where: {
                        categoryId: req.params.id,
                    },
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ]
                })
                .then((product) => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1
                        }
                    })
                    .then(products => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
        
                        Promise.all([categoryPromise, brandPromise])
                        .then(([categories, brands]) => {
                            res.render("productsFilter", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                categories,
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
                where: {
                    categoryId: req.params.id,
                },
                include: [
                    {association: "category"},
                    {association: "brand"}
                ]
            })
            .then((product) => {
                db.Product.findAll({
                    include: [{
                        association: "brand"
                    }],
                    where: {
                        outstanding: 1
                    }
                })
                .then(products => {
                    let categoryPromise = db.Category.findAll()
                    let brandPromise = db.Brand.findAll()
    
                    Promise.all([categoryPromise, brandPromise])
                    .then(([categories, brands]) => {
                        res.render("productsFilter", {
                            titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                            titleSlider: "Destacados",
                            product,
                            categories,
                            brands,
                            destacadosSlider: products,
                            session: req.session
                        })
                    })
                })
            })

        }
    },

    // Filtrar categorias por marcas
    brandFilter: (req, res) => {
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
                    where: {
                        brandId: req.params.id,
                    },
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ]
                })
                .then((product) => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1
                        }
                    })
                    .then(products => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
        
                        Promise.all([categoryPromise, brandPromise])
                        .then(([categories, brands]) => {
                            res.render("productsFilter", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                categories,
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
                where: {
                    brandId: req.params.id,
                },
                include: [
                    {association: "category"},
                    {association: "brand"}
                ]
            })
            .then((product) => {
                db.Product.findAll({
                    include: [{
                        association: "brand"
                    }],
                    where: {
                        outstanding: 1
                    }
                })
                .then(products => {
                    let categoryPromise = db.Category.findAll()
                    let brandPromise = db.Brand.findAll()
    
                    Promise.all([categoryPromise, brandPromise])
                    .then(([categories, brands]) => {
                        res.render("productsFilter", {
                            titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                            titleSlider: "Destacados",
                            product,
                            categories,
                            brands,
                            destacadosSlider: products,
                            session: req.session
                        })
                    })
                })
            })
        }
    },
    // Reordenar productos por
    orderBy: (req, res)=> {
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
                if(req.params.id == "desc"){
                    db.Product.findAll({
                        include: [
                            {association: "category"},
                            {association: "brand"}
                        ],
                        order: [['price', 'DESC']]
                    })
                    .then(product => {
                        db.Product.findAll({
                            include: [{
                                association: "brand"
                            }],
                            where: {
                                outstanding: 1
                            }
                        })
                        .then(products => {
                            let categoryPromise = db.Category.findAll()
                            let brandPromise = db.Brand.findAll()
            
                            Promise.all([categoryPromise, brandPromise])
                            .then(([categories, brands]) => {
                                res.render("productsFilter", {
                                    titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                    titleSlider: "Destacados",
                                    product,
                                    cart: 0,
                                    categories,
                                    brands,
                                    destacadosSlider: products,
                                    session: req.session
                                })
                            })  
                        })
                    })
                }else if(req.params.id == "asc"){
                    db.Product.findAll({
                        include: [
                            {association: "category"},
                            {association: "brand"}
                        ],
                        order: [['price', 'ASC']]
                    })
                    .then(product => {
                        db.Product.findAll({
                            include: [{
                                association: "brand"
                            }],
                            where: {
                                outstanding: 1
                            }
                        })
                        .then(products => {
                            let categoryPromise = db.Category.findAll()
                            let brandPromise = db.Brand.findAll()
        
                            Promise.all([categoryPromise, brandPromise])
                            .then(([categories, brands]) => {
                                res.render("productsFilter", {
                                    titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                    titleSlider: "Destacados",
                                    product,
                                    cart: 0,
                                    categories,
                                    brands,
                                    destacadosSlider: products,
                                    session: req.session
                                })
                            })
                        })
                    })
                }else  if(req.params.id == "discount"){
                    db.Product.findAll({
                        include: [
                            {association: "category"},
                            {association: "brand"}
                        ],
                        order: [['discount', 'DESC']],
                    })
                    .then(product => {
                        db.Product.findAll({
                            include: [{
                                association: "brand"
                            }],
                            where: {
                                outstanding: 1
                            }
                        })
                        .then(products => {
                            let categoryPromise = db.Category.findAll()
                            let brandPromise = db.Brand.findAll()
        
                            Promise.all([categoryPromise, brandPromise])
                            .then(([categories, brands]) => {
                                res.render("productsFilter", {
                                    titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                    titleSlider: "Destacados",
                                    product,
                                    cart: 0,
                                    categories,
                                    brands,
                                    destacadosSlider: products,
                                    session: req.session
                                })
                            })
                        })
                    })
                }
            })
        } else {
            if(req.params.id == "desc"){
                db.Product.findAll({
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ],
                    order: [['price', 'DESC']]
                })
                .then(product => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1
                        }
                    })
                    .then(products => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
        
                        Promise.all([categoryPromise, brandPromise])
                        .then(([categories, brands]) => {
                            res.render("productsFilter", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                categories,
                                brands,
                                destacadosSlider: products,
                                session: req.session
                            })
                        })  
                    })
                })
            }else if(req.params.id == "asc"){
                db.Product.findAll({
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ],
                    order: [['price', 'ASC']]
                })
                .then(product => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1
                        }
                    })
                    .then(products => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
    
                        Promise.all([categoryPromise, brandPromise])
                        .then(([categories, brands]) => {
                            res.render("productsFilter", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                categories,
                                brands,
                                destacadosSlider: products,
                                session: req.session
                            })
                        })
                    })
                })
            }else  if(req.params.id == "discount"){
                db.Product.findAll({
                    include: [
                        {association: "category"},
                        {association: "brand"}
                    ],
                    order: [['discount', 'DESC']],
                })
                .then(product => {
                    db.Product.findAll({
                        include: [{
                            association: "brand"
                        }],
                        where: {
                            outstanding: 1
                        }
                    })
                    .then(products => {
                        let categoryPromise = db.Category.findAll()
                        let brandPromise = db.Brand.findAll()
    
                        Promise.all([categoryPromise, brandPromise])
                        .then(([categories, brands]) => {
                            res.render("productsFilter", {
                                titleBanner: "Pedi tu birra y te la llevamos a tu casa",
                                titleSlider: "Destacados",
                                product,
                                categories,
                                brands,
                                destacadosSlider: products,
                                session: req.session
                            })
                        })
                    })
                })
            }
        }
    },
    // Carrito 
    cart: (req, res) => {
        let user = req.session.user.id
        axios({
        method: 'get',
        url: `http://localhost:3030/api/cart/${user}`,
        })
        .then(response =>{
            let cart = response.data.data?.order_items.map(item => {
                return {
                ...item.products,
                quantity: item.quantity
                }
            })
            res.render('productCart', {
                titleBanner: "Carrito",
                session: req.session,
                cart: cart !== undefined ? cart : [],
                user: req.session.user?.id || null,
            })
        })
    .catch(error =>console.log(error))
  }
}