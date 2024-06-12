let User = require("../models/userModel")
let bcrypt = require("bcrypt")
let nodemailer = require('nodemailer')
let otpgenerator = require('otp-generator')
let jwt = require("jsonwebtoken")

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: 'fahismhmd8@gmail.com',
        pass: 'dwok bvzc dzqi usgi',
    },
    secure: true,
});



let validateFeild = (username, email, password) => {
    const usernameReg = /^(?=.{3,20}$)[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*$/  //
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const passwordReg = /^[a-z0-9]{8,}$/

    if (!usernameReg.test(username) || !emailReg.test(email) || !passwordReg.test(password)) {
        return false
    } else {
        return true
    }

}

module.exports = {

    getUser: async (req, res) => {
        console.log(req.body);
        if (!req.body.password) {
            res.json({ message: "enter the password" })
            return
        }

        try {
            let result = await User.findOne({ email: req.body.email })
            console.log(result);
            if (!result) {
                res.json({ message: "user not found" })
            } else {
                bcrypt.compare(req.body.password, result.password, (err, pass) => {
                    // let obj = {
                    //     username:result.username,
                    //     email:result.email
                    // }

                    if (pass == true) {
                        let obj = {
                            username: result.username,
                            email: result.email
                        }

                        let token = jwt.sign(obj, '1234', { expiresIn: 60 })
                        console.log(token);

                        res.json({ message: 'login successful', token })
                    } else {
                        res.json({ message: "Wrong password" })
                    }
                })

            }

        } catch (err) {

            console.log();
            if (err.message.startsWith("Cast")) {
                res.json({ message: "invalid id" })
            } else {
                res.json({ message: "server error" })
            }
        }


    },



    otpLogin: async (req, res) => {

        console.log(req.body);

        let userexist = await User.findOne({ email: req.body.email })

        if (!userexist) {
            res.json("user doesnot exist")
        } else {

            let otp = otpgenerator.generate(4, { upperCaseAlphabets: false, specialChars: false })

            let result = await User.updateOne({ email: req.body.email }, { otp: otp })
            console.log(result);
            if (result.modifiedCount == 1) {
                const mailData = {
                    from: 'fahismhmd8@gmail.com',  // sender address
                    to: req.body.email,   // list of receivers
                    subject: 'Sending Email using Node.js',
                    // text: otp,
                    html: `<b>Hey there! ${otp}</b>`,
                };

                transporter.sendMail(mailData, function (err, info) {
                    if (err)
                        console.log(err)
                    else
                        console.log(info);
                });
                res.json("otp send succesfully")
            }

        }

    },

    verifyOtp: async (req, res) => {

        console.log(req.body);

        let user = await User.findOne({ email: req.body.email })
        if (user.otp == req.body.otp) {
            let result = await User.updateOne({ email: req.body.email }, { otp: null })
            res.json({ message: 'succefull', loginStatus: true })

        } else {
            res.json({ message: 'invalid otp', loginStatus: false })
        }

    },



    createUser: async (req, res) => {

        console.log(req.body);

        let { username, email, password } = req.body

        if (!validateFeild(username, email, password)) {
            res.json({ message: "enter all fileds" })
            return
        }

        try {
            let result = await User.findOne({ email })

            if (result) {
                res.json("user already exist")
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(hashedPassword);
                        await User.create({ username: username, email: email, password: hashedPassword })
                        res.json({ message: "Signup sucessfull" });

                    }
                })

            }

        } catch (error) {
            console.log(error);
            res.json("email already exist")
        }
    },

    getAllUsers: async (req, res) => {
        console.log(req.body);
        try {
            let result = await User.find();
            res.json(result)

        } catch (err) {
            console.log(err);
            res.json("No datas found")
        }
    },

    deleteUser: async (req, res) => {
        console.log(req.params);
        try {
            let result = await User.findOneAndDelete({ _id: req.params.id });
            if (!result) {
                res.json({ message: "no user exist" })
            } else {
                res.json({ message: "user deleted successfully" })
            }
        } catch (err) {
            console.log(err);
            res.json({ message: "invalid id" })

        }
    },

    updateUser: async (req, res) => {

        let { email, password, username } = req.body


        if (password) {
            // console.log(password);
            let hashedPassword = await bcrypt.hash(req.body.password, 10)
            password = hashedPassword;
            console.log(hashedPassword);
        }

        try {
            console.log(password);
            let result = await User.updateOne({ _id: req.params.id }, {
                email: email,
                username: username,
                password: password
            })


            res.json('updated succesfully')

        } catch (err) {
            console.log(err);
            res.json("No user found")
        }

    },

    updateData: async (req, res) => {
        // update all data of user 
        console.log(req.params);
        console.log(req.body);
        let { email, password, username } = req.body
        try {
            let result = await User.updateOne({ _id: req.params.id }, {
                email: email,
                username: username,
                password: password
            })

            console.log(result);

            res.json('updated succesfuuly')

        } catch (err) {
            console.log(err);
            res.json("No user found")
        }

    }

}

