/*
    Rutas de usuarios
    host + /api/auth
*/

const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');

// controladores
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

// middlewares
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

// rutas
router.post(
    '/new',
    [   //  middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El passsword debe de ser de 6 caracteres').isLength(6),
    ],
    validarCampos, 
    crearUsuario 
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El passsword debe de ser de 6 caracteres').isLength(6),
    ],
    validarCampos,
    loginUsuario 
);

router.get('/renew', validarJWT, revalidarToken );

module.exports = router;