import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { addOutcomeItem, fetchOutcomeItems } from "../../services/api/stock";

export default function Outcome() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    type: "",
    subcategory: "",
    remarks: "",
  });

  // Fetch all outcome items
  const loadOutcomeItems = async () => {
    try {
      const res = await fetchOutcomeItems();
      setItems(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOutcomeItems();
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.itemName || !formData.itemCode || !formData.type) {
      setError("Item Name, Item Code, and Type are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        itemName: formData.itemName,
        itemCode: formData.itemCode,
        type: formData.type,
        subcategory: formData.subcategory,
        remarks: formData.remarks,
      };

      await addOutcomeItem(payload);

      setSuccess("Outcome item added successfully!");
      setFormData({
        itemName: "",
        itemCode: "",
        type: "",
        subcategory: "",
        remarks: "",
      });

      loadOutcomeItems();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to add outcome item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Outcome Management
        </h2>
        <div>
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Outcome Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Preform 500ml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Code *
                </label>
                <input
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  placeholder="PREFORM_500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="preform">Preform</option>
                  <option value="cap">Cap</option>
                  <option value="bottle">Bottle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="500ml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Optional remarks"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Outcome Item"}
              </Button>
            </div>
          </div>

          {/* List Section */}
          {/* --- TABLE CARD --- */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Outcome Items
            </h3>

            {items.length === 0 ? (
              <p className="text-gray-600">No items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Item Name
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Item Code
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Subcategory
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={item._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 border-b text-sm text-gray-800">
                          {item.itemName}
                        </td>
                        <td className="px-4 py-3 border-b text-sm text-gray-600">
                          {item.itemCode}
                        </td>
                        <td className="px-4 py-3 border-b text-sm text-gray-600 capitalize">
                          {item.type}
                        </td>
                        <td className="px-4 py-3 border-b text-sm text-gray-600">
                          {item.subcategory || "-"}
                        </td>
                        <td className="px-4 py-3 border-b text-sm text-gray-600">
                          {item.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
