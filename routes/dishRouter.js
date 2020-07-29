const express = require('express');

const bodyparser = require('body-parser');

//const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyparser.json());

var authenticate = require('../authenticate');
const { populate } = require('../models/dishes');

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'text/plain-text');
    res.end("PUT action not supported");
})
.delete(authenticate.verifyUser, (req, res, next) => {
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
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'text/plain-text');
    res.end("POST action not supported");
})
.put(authenticate.verifyUser, (req, res, next) => {    
    Dishes.findByIdAndUpdate(req.params.dishID, {
        $set :  req.body
    }, {new : true})
    .then((dish) => {
        Dishes.findById(dish._id)
        .populate('comments.author')
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishID)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err));
})


dishRouter.route('/:dishID/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .populate('comments.author')
    .then((dish) => {
        if(dish!= null) {  
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err= new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish!= null) {  
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) =>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
        }
        else {
            err= new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'text/plain-text');
    res.end("PUT action not supported");
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish!= null) {  
            for (val = (dish.comments.length-1); val>=0; val--){
                dish.comments.id(dish.comments[val]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);

            }, (err)=> next(err));
        }
        else {
            err= new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

dishRouter.route('/:dishID/comments/:commentID')
.get((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .populate('comments.author')
    .then((dish) => {
        if(dish!= null) {  
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(dish.comments.id(req.params.commentID));
        }
        else if (dish==null){
            err= new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentID+ ' not found');
            err.status = 404;
            return next(err);           
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'text/plain-text');
    res.end("POST action not supported");
})
.put(authenticate.verifyUser, (req, res, next) => {    
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish!= null && dish.comments.id(req.params.commentID) != null) {  
            if(req.body.rating) {
                dish.comments.id(req.params.commentID).rating= req.body.rating;
            }
            if(req.body.comment) {
                dish.comments.id(req.params.commentID).comment= req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
        }
        else if (dish==null){
            err= new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentID + ' not found');
            err.status = 404;
            return next(err);           
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentID) != null) {
            dish.comments.id(req.params.commentID).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentID + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;