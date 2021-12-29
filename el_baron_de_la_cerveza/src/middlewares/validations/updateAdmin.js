const { check, body } = require('express-validator')
let bcrypt = require('bcryptjs')
const db = require('../../database/models');

module.exports = [
    check('name')
    .notEmpty()
    .withMessage('Debes escribir un nombre'),

    check('email')
    .notEmpty()
    .withMessage('Debes escribir un email').bail()
    .isEmail()
    .withMessage('Debes escribir un email válido'),

    check('pass')
    .notEmpty()
    .withMessage('Debes escribir tu contraseña actual'),

    body('pass')
    .custom((value, { req }) => {
        return db.User.findOne({
            // Buscamos el admin para que compare solo a este usuario
            where: {
                rol: 1,
            },
        })
        .then((user) => {
            // Comparamos la constraseña que viene por body con la guardada en la bd
            if (!bcrypt.compareSync(req.body.pass, user.dataValues.pass)) {
                return Promise.reject();
            }
        })
        .catch((error) => {
            return Promise.reject("Debe ingresar su contraseña actual");
        });
    }),

    check('pass1')
    .notEmpty()
    .withMessage('Debes escribir tu contraseña')
    .isLength({
        min: 6
    })
    .withMessage('La contraseña debe tener como mínimo 6 caracteres'),

    body('pass2')
    .custom((value, {req}) => value !== req.body.pass1 ? false : true)
    .withMessage('Las contraseñas no coinciden')
]