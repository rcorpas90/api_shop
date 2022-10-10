var express = require('express');
var router = express.Router();
var queries=require("../sequelize/queries/product.queries")

router.post('/get', function(req, res, next) {
  queries.getProducts(req.body, function(err, resp){
    if(err){
      res.status(500).json({
        errors: err,
        success: false
    });
    }else{
      res.status(200).json({
        data: resp,
        success: true
    });
    }
  })
});

router.post('/add', function(req, res, next) {
  queries.addProduct(req.body, function(err, resp){
    if(err){
      res.status(500).json({
        errors: err,
        success: false
    });
    }else{
      res.status(200).json({
        data: resp,
        success: true
    });
    }
  })
});

router.post('/update', function(req, res, next) {
  queries.updateProduct(req.body, function(err, resp){
    if(err){
      res.status(500).json({
        errors: err,
        success: false
    });
    }else{
      res.status(200).json({
        success: true
    });
    }
  })
});

router.post('/delete', function(req, res, next) {
  queries.deleteProduct(req.body, function(err, resp){
    if(err){
      res.status(500).json({
        errors: err,
        success: false
    });
    }else{
      res.status(200).json({
        success: true
    });
    }
  })
});




module.exports = router;
