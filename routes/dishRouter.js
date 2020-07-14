const express = require('express');

const bodyparser = require('body-parser');

const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyparser.json());

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'text/plain-text');
    res.end("PUT action not supported");
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})

dishRouter.route('/:dishID')
.get((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'text/plain-text');
    res.end("POST action not supported");
})
.put((req, res, next) => {    
    Dishes.findByIdAndUpdate(req.params.dishID, {
        $set :  req.body
    }, {new : true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishID)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = dishRouter;