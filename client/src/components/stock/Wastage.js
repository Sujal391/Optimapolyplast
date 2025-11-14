import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  recordWastage,
  updateWastageReuse,
  getWastageReport,
} from "../../services/api/stock";

export default function Wastage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [wastageList, setWastageList] = useState([]);

  // --- Form state ---
  const [formData, setFormData] = useState({
    wastageType: "",
    source: "",
    quantityGenerated: "",
    quantityReused: 0,
    reuseReference: "",
    remarks: "",
    date: new Date().toISOString().split("T")[0],
  });

  // --- Reuse Modal State ---
  const [reuseModal, setReuseModal] = useState({
    open: false,
    wastageId: null,
    quantityGenerated: 0,
    quantityReused: 0,
  });

  const [reuseData, setReuseData] = useState({
    quantityReused: "",
    reuseReference: "",
    remarks: "",
  });

  // Fetch wastage list
  const loadWastage = async () => {
    try {
      const res = await getWastageReport();
      setWastageList(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWastage();
  }, []);

  // Input Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleReuseChange = (e) => {
    const { name, value } = e.target;
    setReuseData((p) => ({ ...p, [name]: value }));
  };

  // Submit Add Wastage
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.wastageType || !formData.source || !formData.quantityGenerated) {
      setError("Wastage Type, Source & Quantity Generated are required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        wastageType: formData.wastageType,
        source: formData.source,
        quantityGenerated: Number(formData.quantityGenerated),
        quantityReused: Number(formData.quantityReused),
        reuseReference: formData.reuseReference,
        remarks: formData.remarks,
        date: new Date(formData.date).toISOString(),
      };

      await recordWastage(payload);

      setSuccess("Wastage recorded successfully!");
      setFormData({
        wastageType: "",
        source: "",
        quantityGenerated: "",
        quantityReused: 0,
        reuseReference: "",
        remarks: "",
        date: new Date().toISOString().split("T")[0],
      });

      loadWastage();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to record wastage");
    } finally {
      setLoading(false);
    }
  };

  // Submit Reuse
  const handleReuseSubmit = async () => {
    setError("");
    setSuccess("");

    const { wastageId, quantityGenerated, quantityReused } = reuseModal;
    const newReuse = Number(reuseData.quantityReused);

    if (newReuse <= 0) {
      setError("Reuse quantity must be greater than 0.");
      return;
    }

    if (newReuse + quantityReused > quantityGenerated) {
      setError(
        `Cannot reuse more than generated. Generated: ${quantityGenerated}, Already reused: ${quantityReused}, Trying: ${newReuse}`
      );
      return;
    }

    try {
      const payload = {
        wastageId,
        quantityReused: newReuse,
        reuseReference: reuseData.reuseReference,
        remarks: reuseData.remarks,
      };

      await updateWastageReuse(payload);

      setSuccess("Reuse recorded successfully!");
      setReuseModal({ open: false, wastageId: null });
      setReuseData({ quantityReused: "", reuseReference: "", remarks: "" });

      await loadWastage();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to record reuse");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Wastage Management
        </h2>

        {/* Success & Error */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* ADD WASTAGE FORM */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Record Wastage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Wastage Type */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Wastage Type *
              </label>
              <select
                name="wastageType"
                value={formData.wastageType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Type 1: Reusable Wastage">
                  Type 1: Reusable Wastage
                </option>
                <option value="Type 2: Non-reusable / Scrap">
                  Type 2: Non-reusable / Scrap
                </option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Source *</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Source</option>
                <option value="Preform">Preform</option>
                <option value="Cap">Cap</option>
                <option value="Bottle">Bottle</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm mb-1">Quantity Generated *</label>
              <input
                type="number"
                name="quantityGenerated"
                value={formData.quantityGenerated}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Remarks</label>
              <textarea
                name="remarks"
                rows="3"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional remarks"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Recording..." : "Record Wastage"}
            </Button>
          </div>
        </div>

        {/* WASTAGE TABLE */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Wastage Records
          </h3>

          {wastageList.length === 0 ? (
            <p className="text-gray-600">No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Source
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Generated
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Reused
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Scrapped
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {wastageList.map((item, idx) => (
                    <tr
                      key={item._id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {item.wastageType}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {item.source}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {item.quantityGenerated}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {item.quantityReused}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {item.quantityScrapped}
                      </td>
                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 border-b text-sm">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                          onClick={() =>
                            setReuseModal({
                              open: true,
                              wastageId: item._id,
                              quantityGenerated: item.quantityGenerated,
                              quantityReused: item.quantityReused,
                            })
                          }
                        >
                          Reuse
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* REUSE MODAL */}
        {reuseModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Record Wastage Reuse
              </h3>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Generated:</strong> {reuseModal.quantityGenerated}
              </p>

              <p className="text-sm text-gray-700 mb-4">
                <strong>Already Reused:</strong> {reuseModal.quantityReused}
              </p>

              <div className="mb-4">
                <label className="block text-sm mb-1">Reuse Quantity *</label>
                <input
                  type="number"
                  name="quantityReused"
                  value={reuseData.quantityReused}
                  onChange={handleReuseChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Reuse Reference</label>
                <input
                  type="text"
                  name="reuseReference"
                  value={reuseData.reuseReference}
                  onChange={handleReuseChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Batch number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Remarks</label>
                <textarea
                  rows="3"
                  name="remarks"
                  value={reuseData.remarks}
                  onChange={handleReuseChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                  onClick={() => setReuseModal({ open: false })}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleReuseSubmit}
                >
                  Save Reuse
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
