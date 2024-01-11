require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Employee } = require("../models/employee");
const { Enquiry } = require("../models/enquiry");
const enquiryRouter = express.Router();


enquiryRouter.post('/add', async (req, res) => {
    const { name, email, courseInterest } = req.body;

    if (!name || !email || !courseInterest) {
        return res.status(500).send({ message: "Fill all the details" });

    }

    const newEnquiry = new Enquiry({
        name,
        email,
        courseInterest,
    });
    try {
        await newEnquiry.save();
        res.status(201).send({ message: 'Enquiry saved ! Wait for to be claimed ' });




    } catch (error) {
        console.lor({ error: error.message })
        res.status(500).send({ message: 'Something went wrong  while summitting the form' });
    }
});

const isLoggedIn = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.employeeId = decoded.employeeId;
        next();
    });
};



enquiryRouter.get("/all-enquiry", async (req, res) => {

    try {
        let allEnquiry = await Enquiry.find({ claimed: false })
        return res.status(200).send(allEnquiry);

    } catch (error) {
        console.error({ error: "Error in getting all Enquiry unclaimed type" });
        res.status(500).send({ message: 'Something went wrong' });

    }
})




enquiryRouter.get("/my-enquiry", isLoggedIn, async (req, res) => {

    const employeeId = req.employeeId;
    try {
        let allEnquiry = await Enquiry.find({ claimedBy: employeeId })
        return res.status(200).send(allEnquiry);

    } catch (error) {
        console.error({ error: "Error in getting all Enquiry unclaimed type" });
        res.status(500).send({ message: 'Something went wrong in fetching Individual queries !' });
    }
})



enquiryRouter.post('/claim/:enquiryId', isLoggedIn, async (req, res) => {
    const { enquiryId } = req.params;
    const employeeId = req.employeeId;

    const enquiry = await Enquiry.findById(enquiryId); 

    if (!enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
    }


    if (enquiry.claimedBy) {
        return res.status(400).json({ message: 'Enquiry already claimed' });
    }

    try {
        await Enquiry.updateOne({ _id: enquiryId }, { claimed: true, claimedBy: employeeId })
        res.json({ message: 'Enquiry claimed successfully' });

    } catch (error) {
        console.error({ error: "Error while claiming the enquiry" });
        res.status(500).send({ message: 'Something went wrong' });
    }
});




module.exports = { enquiryRouter };