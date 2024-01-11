const mongoose = require('mongoose');
const { Schema } = mongoose;


const employeeSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true },
}, { versionKey: false });



const Employee = mongoose.model('Employee', employeeSchema);

module.exports = { Employee };