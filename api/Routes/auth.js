const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");


const { withDB } = require("../dbConnect");
const { generateAuthToken, validate } = require("../models/user.model");



router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        withDB(async (db) => {
            const user = await db.collection("users").findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).send({ message: "Email not found" });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) {
                return res.status(401).send({ message: "Invalid Email or Password" })
            }

            const token = generateAuthToken(user);
            res.status(200).send({ data: token, message: "Logged in successfully" })
        }, res)

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})


const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = router