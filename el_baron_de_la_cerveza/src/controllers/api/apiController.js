let db = require('../../database/models')

module.exports = {
    allCategories: (req, res)=>{
        db.Categories.findAll()
        .then(categories => {
            res.status(200).json({
                meta: {
                    status: 200,
                    total: categories.length
                },
                data: categories
            })
        })
    },
    oneCategory: (req, res) => {
        db.Categories.findOne({where: {id:req.params.id }}).then(category => {
            res.status(200).json({
                meta:{
                    status: 200
                },
                data: category
            })
        })
    }
}