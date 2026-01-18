const Gear = require('../models/Gear');

// @desc    Get all gears
// @route   GET /api/gears
// @access  Public
exports.getAllGears = async (req, res) => {
  try {
    const gears = await Gear.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gears.length,
      data: gears
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gears'
    });
  }
};

// @desc    Add new gear
// @route   POST /api/gears
// @access  Admin
exports.addGear = async (req, res) => {
  try {
    const { name, category, price, quantity, image } = req.body;

    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const gear = await Gear.create({
      name,
      category,
      price,
      quantity,
      image: image || '' // Default to empty string if no image provided
    });

    res.status(201).json({
      success: true,
      message: 'Gear added successfully',
      data: gear
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add gear'
    });
  }
};

// @desc    Update gear
// @route   PUT /api/gears/:id
// @access  Admin
exports.updateGear = async (req, res) => {
  try {
    const gearId = req.params.id;
    
    // 1. Create a copy of the body to clean it
    let updateData = { ...req.body };

    // 2. Remove 'name' from the update if it's just an empty string
    // This prevents overwriting the existing name with "nothing"
    if (updateData.name === "" || updateData.name === undefined) {
      delete updateData.name;
    }

    // 3. Perform the update
    const updatedGear = await Gear.findByIdAndUpdate(
      gearId,
      { $set: updateData }, // Now only contains fields that actually have values
      { new: true, runValidators: true }
    );

    if (!updatedGear) {
      return res.status(404).json({
        success: false,
        message: 'Gear not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gear updated successfully',
      data: updatedGear
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gear'
    });
  }
};

// @desc    Delete gear
// @route   DELETE /api/gears/:id
// @access  Admin
exports.deleteGear = async (req, res) => {
  try {
    const gear = await Gear.findById(req.params.id);

    if (!gear) {
      return res.status(404).json({
        success: false,
        message: 'Gear not found'
      });
    }

    await gear.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gear deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gear'
    });
  }
};
