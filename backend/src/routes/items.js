const express=require('express');
const router=express.Router();
const {createItem,getAllItems, updateItem,deleteItem,getItemBySku,getItemById}=require('../controllers/itemsController');

const {protect}=require('../middlewares/authMiddleware');


router.get('/unprinted', protect, require('../controllers/itemsController').getUnprintedItems);
router.post('/mark-printed', protect, require('../controllers/itemsController').markAsPrinted);
router.post('/',protect,createItem);
router.get('/', protect, getAllItems);
router.get('/scan/:sku', protect, getItemBySku);
router.get('/:id', protect, getItemById);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
module.exports=router;