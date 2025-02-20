const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
// const calculationData = data.calculations;
const xss = require('xss');
const validation = require('../validation');

router
    .route('/login')
    .post(async (req, res) => {
        if (req.session.user) {
            return res.status(400).json({error: 'User already logged in!'})
        }
        try {
            req.body.email = validation.checkEmail(xss(req.body.email));
            req.body.password = validation.checkPassword(xss(req.body.password));
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
        // check if the user exists
        try {
            const user = await userData.getUserByEmail(xss(req.body.email))
            if (user.empty) throw `Error: user not found`
        } catch (e) {
            console.log(e)
            return res.status(404).json({error: e})
        }
        // validate the user
        try {
            let user = await userData.checkUserByEmail(xss(req.body.email), xss(req.body.password))
            req.session.user = user

            let currMonth = new Date();
            currMonth = currMonth.getMonth();

            if (user.payInfo.month === -1) {
                user = await userData.resetMonth(req.session.user.id);
            } else if (user.payInfo.month !== currMonth) {
                user = await userData.resetData(req.session.user.id);
            }

            //if payInfo.month == 0 then make payInfo.month == to current month
            //if payInfo.month !== current month then reset all data, monthIncome, monthSpending, transactions, balances for Spending

            req.session.user = user
            console.log(' validating', req.session.user)
            res.status(200).json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
    })

router
    .route('/loginauth')
    .post(async (req, res) => {
        if (req.session.user) {
            return res.status(400).json({error: 'User already logged in!'})
        }
        try {
            req.body.uid = validation.checkString(xss(req.body.uid))
            req.body.email = validation.checkEmail(xss(req.body.email))
            let authUser = await userData.getUserByEmail(xss(req.body.email))
            // if the user doesn't exist yet, create them
            if (authUser.empty) {
                const user = await userData.createUserByAuth(
                    xss(req.body.uid),
                    xss(req.body.displayName),
                    xss(req.body.email)
                )
                if (!user.userInserted) return res.status(500).json({error: `Internal Server Error`})
                // query them again
                authUser = await userData.getUserByEmail(xss(req.body.email))
            }
            // there's an account already created through ogie
            if (!authUser.displayName) {
                return res.status(400).json({error: 'Normal account with this email already exists - log in through the form instead!'})
            }
            delete authUser['password']
            const ret = {
                loggedIn: true,
                ...authUser
            }
            // console.log('google auth', ret)

            req.session.user = authUser

            let currMonth = new Date();
            currMonth = currMonth.getMonth();

            if (authUser.payInfo.month === -1) {
                authUser = await userData.resetMonth(req.session.user.id);
            } else if (authUser.payInfo.month !== currMonth) {
                authUser = await userData.resetData(req.session.user.id);
            }

            req.session.user = authUser
            // console.log(authUser)
            res.status(200).json(ret)
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
    })

router
    .route('/signup')
    .post(async (req, res) => {
        try {
            req.body.firstName = validation.checkName(xss(req.body.firstName), 'first name')
            req.body.lastName = validation.checkName(xss(req.body.lastName), 'last name')
            req.body.username = validation.checkUsername(xss(req.body.username))
            const userExists = await userData.getUserByUsername(xss(req.body.username))
            if (!userExists.empty) throw `Error: username already exists`
            req.body.password = validation.checkPassword(xss(req.body.password))
            req.body.confirmPassword = await userData.confirmPassword(xss(req.body.password), xss(req.body.confirmPassword), false);
            req.body.email = validation.checkEmail(xss(req.body.email))
            const emailExists = await userData.getUserByEmail(xss(req.body.email))
            if (!emailExists.empty) throw `Error: email already exists`
            const user = await userData.createUser(
                xss(req.body.firstName), 
                xss(req.body.lastName), 
                xss(req.body.username), 
                xss(req.body.password), 
                xss(req.body.email)
            )
            if (user.userInserted) {
                const loginUser = await userData.checkUserByEmail(req.body.email, req.body.password)
                req.session.user = loginUser
                res.status(200).json(loginUser)
            }
            else {
                return res.status(500).json({error: `Internal Server Error`})
            }
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
    })

router
    .route('/logout')
    .get(async (req, res) => {
        if (req.session.user) {
            req.session.destroy();
            const message = 'User logged out!'
            console.log(message)
            res.status(200).json(message)
        }
        else {
            return res.status(400).json({error: 'User not logged in!'})
        }
    })

router
    .route('/session')
    .get(async (req, res) => {
        if (req.session.user) {
            // console.log('session', req.session.user)
            res.status(200).json(req.session.user)
        }
        else {
            return res.status(200).json({error: 'User not logged in!'})
        }
    })

router
    .route('/update/:field')
    .post(async (req, res) => {
        if (!req.session.user) {
            return res.status(400).json({error: 'User not logged in!'})
        }
        try {
            const field = validation.checkString(xss(req.params.field))
            const updateFields = [
                'firstName', 
                'lastName', 
                'email',
                'username',
                'password',
                'bank',
                'bankBalance',
                'credit',
                'creditBalance',
                'creditLimit',
                'payFrequency',
            ]
            const updateValidations = {
                firstName: validation.checkName,
                lastName: validation.checkName,
                email: validation.checkEmail,
                username: validation.checkUsername,
                password: validation.checkPassword,
                bank: validation.checkName,
                bankBalance: validation.checkBankBalance,
                credit: validation.checkName,
                creditBalance: validation.checkCreditBalance,
                creditLimit: validation.checkCreditLimit,
                payFrequency: validation.checkPayFrequency,
            }
            const updateFunc = {
                firstName: userData.updateFirstName,
                lastName: userData.updateLastName,
                email: userData.updateEmail,
                username: userData.updateUsername,
                password: userData.updatePassword,
                bank: userData.updateBank,
                bankBalance: userData.updateBankBalance,
                credit: userData.updateCreditCard,
                creditBalance: userData.updateCreditBalance,
                creditLimit: userData.updateCreditLimit,
                payFrequency: userData.updatePayFrequency,
            }
            if (!updateFields.includes(field)) throw `No such field ${field} to update`
            const updateValue = updateValidations[field](xss(req.body.value))
            const { id } = req.body
            const userExists = await userData.getUser(id)
            if (!userExists) throw 'User does not exist'
            if (field === 'email') {
                const emailExists = await userData.getUserByEmail(updateValue)
                if (!emailExists.empty) throw 'Email already exists - try a different one'
            }
            if (field === 'username') {
                const usernameExists = await userData.getUserByUsername(updateValue)
                if (!usernameExists.empty) throw 'Username already exists - try a different one'
            }
            console.log('here');
            const user = await updateFunc[field](id, updateValue)
            req.session.user = user
            return res.status(200).json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
        

    })

module.exports = router;