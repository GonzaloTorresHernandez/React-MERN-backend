/*
    Rutas de eventos
    host + /api/events
*/
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');

// middlewares
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

// controlador
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

// Helpers
const { isDate } = require('../helpers/isDate');

// Aplicar validacion en todas las rutas
router.use( validarJWT );

router.get(
    '/',
    getEventos
);

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
    ],
    validarCampos,
    crearEvento
);

router.put(
    '/:id',
    actualizarEvento
);

router.delete(
    '/:id',
    eliminarEvento
);


module.exports = router;
