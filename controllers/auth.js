const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email: email });

        if (usuario !== null) {
            return res.status(400).json({
                ok: false,
                message: 'un usuario ya existe con ese correo'
            });
        }

        usuario = new Usuario({ name, email, password });

        //  Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //  Generar JWT
        const token = await generarJWT(usuario._id, usuario.name);

        res.status(201).json({
            ok: true,
            message: 'registro',
            uid: usuario._id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Por favor hablar con el administrador'
        });
    }

};

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //  Validar que el correo este registrado
        const usuario = await Usuario.findOne({ email: email });
        if (usuario === null) {
            return res.status(400).json({
                ok: false,
                message: 'el usuario no existe con ese email'
            });
        }

        //  Confirmar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'password incorrecto'
            });
        }

        //  Generar el JWT
        const token = await generarJWT(usuario._id, usuario.name);


        res.status(200).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Por favor hablar con el administrador'
        });
    }


}


const revalidarToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    //  Generar el JWT
    const token = await generarJWT(uid, name);


    res.status(200).json({ ok: true, token });

};



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}