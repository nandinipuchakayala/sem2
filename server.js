
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Student Schema
const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    }
});

const Student = mongoose.model('Student', studentSchema);

// Add Student
app.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        res.status(201).json({
            message: 'Student added successfully!'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Get All Students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Update Student
app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { studentName: req.body.studentName },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json({
            message: 'Student updated successfully!'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Delete Student
app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json({
            message: 'Student deleted successfully!'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully!');

        app.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });
    })
    .catch(error => {
        console.log('MongoDB Connection Error:', error.message);
    });
