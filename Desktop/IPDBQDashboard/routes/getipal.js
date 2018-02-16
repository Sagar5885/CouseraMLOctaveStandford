var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

//var client = new cassandra.Client({contactPoints: ['172.16.118.12']});
//var client = new cassandra.Client({contactPoints: ['dse.stg0.item-pricing.services.prod.walmart.com']});
//var client = new cassandra.Client({contactPoints: ['10.247.146.1']});

var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;
var client = new cassandra.Client({ contactPoints:['10.247.146.1:9042'],
    authProvider: new PlainTextAuthProvider('item_pricing_app', 'itempricingapp')});

client.connect(function(err, result){
    console.log('IP: cassandra connected');
});

/* Get IP on GetIp Page! */
router.get('/:offer_id/:storefront_id', function(req, res) {

    var getitemprice = "select * from item_pricing.pricing where offer_id = ? and storefront_id = ?";

    //var getitemprice = "select * from item_pricing.pricing where offer_id = '6973C5760A034B91BDE53ED5CC765B1E' and storefront_id = 'F2AC45A479F04796A584DD9FCE751842'";

    console.log("******Get IP: %s", req.params.offer_id);
    console.log("******Get IP: %s", req.params.storefront_id);

    client.execute(getitemprice, [req.params.offer_id, req.params.storefront_id],
    //client.execute(getitemprice, [],
        function(err, result){
            if(err){
                res.status(404).send({msg: err});
            }else if(result.rows[0] != null){
                console.log('Offer Found in GetIP');
                console.log(result);
                res.render('getip', {
                    offer_id: result.rows[0].offer_id,
                    storefront_id: result.rows[0].storefront_id,
                    current_price: result.rows[0].current_price
                })
            }else{
                res.status(404).send({msg: 'Fail to find or load Offer Data!'});
            }
        });
});

module.exports = router;