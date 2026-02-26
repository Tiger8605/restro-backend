const { Category, Dish } = require("../models/menuModel");
/* ===============================
   CREATE CATEGORY
================================= */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // 🔥 Check duplicate per owner
    const existing = await Category.findOne({
      name: name.trim(),
      ownerId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      ownerId: req.user.id, // 🔥 VERY IMPORTANT
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ===============================
   GET ALL CATEGORIES 
================================= */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      ownerId: req.user.id, // 🔥 filter by owner
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   DELETE CATEGORY
================================= */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      ownerId: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/* ===============================
   CREATE DISH
================================= */
exports.createDish = async (req, res) => {
    try{
        const { name, description, price, image, categoryId} = req.body;
         
        if (!name || !price || !categoryId){
            return res.status(400).json({
                success: false,
                message: "Name, price and category are required",
            });
        }

        const category = await Category.findOne({
            _id: categoryId,
            ownerId: req.user.id,
        });

        if (!category){
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const dish = await Dish.create({
            name,
            description,
            price,
            image,
            categoryId, 
            ownerId: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Dish created successfully",
            data: dish,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"Server error",
            error: error.message,
        });
    }
};



/* ===============================
   GET ALL DISHES
================================= */
exports.getDishes = async (req, res) => {
    try{
        const dishes = await Dish.find({
            ownerId: req.user.id,
        })
        .populate("categoryId", "name")
        .sort({createdAt: -1});

        res.status(200).json({
            success:true,
            data: dishes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



/* ===============================
   UPDATE DISH
================================= */
exports.updateDish = async (req, res) => {
    try{
        const {id} = req.params;

        const dish = await Dish.findOne({
            _id: id,
            ownerId: req.user.id,
        });

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: " Dish not found",
            });
        }

        Object.assign(dish, req.body);

        await dish.save();

        res.status(200).json({
            success: true,
            message: "Dish updated succeessfully",
            data: dish,
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



/* ===============================
   DELETE DISH
================================= */
exports.deleteDish = async (req, res) => {
    try{
        const {id} = req.params;

        const dish = await Dish.findOne({
            _id: id,
            ownerId: req.user.id,
        });

        if (!dish){
            return res.status(404).json({
                success: false,
                message: "Dish not found",
            });        
        }

        await Dish.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Dish deleted successfully",
        });
        } catch (error){
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
};