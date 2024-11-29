//import express
const express = require('express');

// Import validationResult from express-validator
const { validationResult } = require('express-validator');

//import jsonwebtoken
const jwt = require('jsonwebtoken');

//import bcrypt
const bcrypt = require('bcryptjs');

//import prisma client
const prisma = require('../../../../prisma/client');

//function register
const register = async (req, res) => {
    // Periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        //insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        //return response json
        res.status(201).send({
            success: true,
            message: 'Register successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        });
    }
};

const login = async (req, res) => {
    // Periksa hasil validasi
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    try {
        //find user
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });

        //user not found
        if (!user)
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });

        //compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        //password incorrect
        if (!validPassword)
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });

        //generate token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Destructure to remove password from user object
        const { password, ...userWithoutPassword } = user;

        //return response
        res.status(200).send({
            success: true,
            message: 'Login successfully',
            data: {
                user: userWithoutPassword,
                token: token,
            },
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { register, login };
