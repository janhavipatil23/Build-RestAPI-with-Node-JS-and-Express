const Joi = require('joi');
const express = require('express');
const func = require('joi/lib/types/func');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'abc' },
    { id: 2, name: 'pqr' },
    { id: 3, name: 'xyz' }
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {

    // const schema = {
    //     name: Joi.string().min(3).required()
    // };

    // const result = Joi.validate(req.body, schema);

    // if (result.error) {
    //     //bad request
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }

    const { error } = validateCourse(req.body); //result.error

    if (error) {
        //bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {

    //look up the course
    //if not existing then 404

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course with ID not found');
        return;
    }
    // res.send(course);

    //validate
    //if invalid then 404

    // const schema = {
    //     name: Joi.string().min(3).required()
    // };

    // const result = Joi.validate(req.body, schema);

    // const result = validateCourse(req.body);

    //object destructing
    const { error } = validateCourse(req.body); //result.error

    if (error) {
        //bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    //return updated course

    course.name = req.body.name;
    res.send(course);

});

//api/courses/1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('Course with ID not found');
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    res.send(req.params.id);
});

app.delete('/api/courses/:id', (req, res) => {
    //lookup the course
    //if it does not exist then 404

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('Course with ID not found');

    //delete

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return same course which was deleted 
    res.send(course);
});

//port
// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
// app.put();
// app.post();
// app.delete();

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);

}