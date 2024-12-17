const { response } = require('express');

//  Model
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        eventos
    });

};

const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(200).json({
            ok: true,
            evento: eventoGuardado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }

};

const actualizarEvento = async (req, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'Evento no existe por ese ID'
            });
        }

        if (evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( id, nuevoEvento, { new: true } );

        res.status(200).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }

};

const eliminarEvento = async (req, res = response) => {

    const { id } = req.params;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                message: 'Evento no existe por ese ID'
            });
        }

        if (evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio de editar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete( id );

        res.status(200).json({
            ok: true
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        }); 
    }

};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
};