/**
 * Example controller to demonstrate controller pattern
 */

// Get all examples
exports.getAllExamples = async (req, res, next) => {
  try {
    // In a real application, this would fetch data from a database
    const examples = [
      { id: 1, name: 'Example 1' },
      { id: 2, name: 'Example 2' }
    ];
    
    return res.status(200).json({
      success: true,
      data: examples
    });
  } catch (error) {
    next(error);
  }
};

// Get single example by ID
exports.getExampleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // In a real application, this would fetch data from a database
    const example = { id: parseInt(id), name: `Example ${id}` };
    
    return res.status(200).json({
      success: true,
      data: example
    });
  } catch (error) {
    next(error);
  }
};

// Create new example
exports.createExample = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // In a real application, this would save to a database
    const newExample = { id: Date.now(), name };
    
    return res.status(201).json({
      success: true,
      data: newExample
    });
  } catch (error) {
    next(error);
  }
};
