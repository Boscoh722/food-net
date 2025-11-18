// backend/src/controllers/categoryController.js
import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching categories' 
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    
    const category = new Category({
      name,
      icon: icon || '📦'
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (err) {
    console.error('Create category error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error creating category' 
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, icon },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating category' 
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting category' 
    });
  }
};
