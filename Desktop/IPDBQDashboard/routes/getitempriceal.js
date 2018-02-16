var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

//var client = new cassandra.Client({contactPoints: ['172.16.118.12']});
//var client = new cassandra.Client({contactPoints: ['dse.stg0.item-pricing.services.prod.walmart.com']});

var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;
var client = new cassandra.Client({ contactPoints:['10.247.146.1:9042'],
    authProvider: new PlainTextAuthProvider('item_pricing_app', 'itempricingapp')});

client.connect(function(err, result){
    console.log('Item Pricing Cassandra Connected!');
});

/* GET item price */
router.get('/', function(req, res) {
    res.render('getitemprice');
});

var isValidUser = function(offerId,sfId){
    if( !offerId || !sfId ){
        return false;
    }
    return true;
};

/* Post Add Subscriber *///9E3FBB0A9CE811E489D3123B93F75CBA, F2AC45A479F04796A584DD9FCE751842
router.post('/', function(req, res){

    if( !isValidUser(req.body.offer_id, req.body.storefront_id) ){
        res.status(400).send("Invalid Values!");
        return;
    }
    var getitemprice = "select * from item_pricing.pricing where offer_id = ? and storefront_id = ?";

    console.log('******Get item Price Start!');

    client.execute(getitemprice, [req.body.offer_id, req.body.storefront_id],
        function(err, result){
            if(err){
                res.status(404).send({msg: err});
            }else{
                console.log('Offer Found!');
                console.log(result);
                res.redirect('/getip/'+req.body.offer_id+'/'+req.body.storefront_id);
            }
        });
});

module.exports = router;