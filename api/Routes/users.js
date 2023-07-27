const router = require("express").Router();
const bcrpt = require("bcrypt");

const { withDB } = require("../dbConnect");
const { validate } = require("../models/user.model")


router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        // console.log(error.details[0].message)
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }
        withDB(async (db) => {
            const user = await db.collection("users").findOne({ email: req.body.email });
            if (user) {
                return res.status(409).send({ message: "User with given email already exist!" })
            }
            const salt = await bcrpt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrpt.hash(req.body.password, salt);

            const newUser = { ...req.body, password: hashPassword }

            await db.collection("users").insertOne(newUser);

            res.status(201).send({ message: "User created successfully" })
        }, res);

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})


module.exports = router