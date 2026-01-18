const Order = require('../models/Order');
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Only logged-in users can place orders
router.post('/checkout', authenticateToken, createOrder);

router.get('/myorders', authenticateToken, getMyOrders);

router.get('/all', authenticateToken, async (req, res) => {
    try {
        // We add .populate to 'items.productId' to get the CURRENT stock
        const orders = await Order.find()
            .populate('user', 'username name email')
            .populate('items.product') // This brings in the full Product object
            .sort({ createdAt: -1 });

        res.json({ success: true, data: orders });
    } catch (err) {
        console.error("Backend Error:", err); // This will show the real error in your terminal
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT route for updating status
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        // Find the order by ID and update the status field
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true } // This returns the updated document instead of the old one
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE route to remove an order by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Find the order by the ID passed in the URL and remove it
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Order deleted successfully" 
            // We don't need to send the data back, just a success message
        });
    } catch (err) {
        console.error("Delete Route Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error during deletion" 
        });
    }
});

module.exports = router;