const express=require('express');
const router=express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {checkout,getAllSales,getSaleById}=require('../controllers/saleController');

router.post('/checkout',protect,checkout);
router.get('/',protect,getAllSales);
router.get('/:id',protect,getSaleById);

module.exports=router;