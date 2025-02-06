import React, { useEffect, useState, useCallback } from "react";

const MultiColorPicker = ({ onColorChange, getProductColors }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (Array.isArray(getProductColors)) {
      setSelectedColors(getProductColors);
    }
  }, [getProductColors]);

  const addColor = useCallback(() => {
    if (!selectedColors.includes(currentColor)) {
      const updatedColors = [...selectedColors, currentColor];
      setSelectedColors(updatedColors);
      onColorChange(updatedColors);
    }
    setPickerVisible(false);
  }, [selectedColors, currentColor, onColorChange]);

  const removeColor = useCallback(
    (color) => {
      const updatedColors = selectedColors.filter((c) => c !== color);
      setSelectedColors(updatedColors);
      onColorChange(updatedColors);
    },
    [selectedColors, onColorChange]
  );

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Toggle Color Picker */}
      <div>
        <button
          onClick={() => setPickerVisible(!pickerVisible)}
          className="px-4 py-2 bg-black text-white rounded-md shadow hover:bg-black/80"
        >
          {pickerVisible ? "Cancel" : "Pick a Color"}
        </button>
      </div>

      {/* Color Picker Input */}
      {pickerVisible && (
        <div className="flex items-center space-x-4 mt-4">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-12 h-12 cursor-pointer border border-gray-300 rounded-md shadow"
          />
          <button
            onClick={addColor}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
          >
            Add Color
          </button>
        </div>
      )}

      {/* Selected Colors Display */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedColors.map((color, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 px-3 py-1 bg-gray-100 border border-gray-300 rounded-md shadow"
          >
            {/* Color Swatch */}
            <div
              className="w-6 h-6 rounded-full border border-gray-400"
              style={{ backgroundColor: color }}
            ></div>
            {/* Hex Value */}
            <span className="text-sm font-medium text-gray-800">{color}</span>
            {/* Remove Button */}
            <button
              onClick={() => removeColor(color)}
              className="text-red-500 font-bold hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Display Placeholder if No Colors */}
      {selectedColors.length === 0 && (
        <p className="text-sm text-gray-500">No colors selected.</p>
      )}
    </div>
  );
};

export default MultiColorPicker;
