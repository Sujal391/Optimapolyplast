import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  updateWastageReuse,
  getWastageReport,
} from "../../services/api/stock";

export default function Wastage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [wastageList, setWastageList] = useState([]);

  // --- Reuse Modal State ---
  const [reuseModal, setReuseModal] = useState({
    open: false,
    wastageId: null,
    wastageType: "",
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

  const handleReuseChange = (e) => {
    const { name, value } = e.target;
    setReuseData((p) => ({ ...p, [name]: value }));
  };

  // Submit Reuse - Only for Type 1 wastage
  const handleReuseSubmit = async () => {
    setError("");
    setSuccess("");

    const { wastageId, wastageType, quantityGenerated, quantityReused } = reuseModal;

    // Block reuse for Type 2 wastage
    if (wastageType === "Type 2: Non-reusable / Scrap") {
      setError("Type 2 (Non-reusable / Scrap) wastage cannot be reused.");
      return;
    }

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
      setLoading(true);

      const payload = {
        wastageId,
        quantityReused: newReuse,
        reuseReference: reuseData.reuseReference,
        remarks: reuseData.remarks,
      };

      await updateWastageReuse(payload);

      setSuccess("Reuse recorded successfully!");
      setReuseModal({ open: false, wastageId: null, wastageType: "" });
      setReuseData({ quantityReused: "", reuseReference: "", remarks: "" });

      await loadWastage();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to record reuse");
    } finally {
      setLoading(false);
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

        {/* INFO NOTICE */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Wastage records are created automatically during production (Preform, Cap, or Bottle).
            This page allows you to view all wastage records and reuse <strong>Type 1 (Reusable)</strong> wastage only.
          </p>
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
                        {item.wastageType === "Type 1: Reusable Wastage" ? (
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                            onClick={() =>
                              setReuseModal({
                                open: true,
                                wastageId: item._id,
                                wastageType: item.wastageType,
                                quantityGenerated: item.quantityGenerated,
                                quantityReused: item.quantityReused,
                              })
                            }
                          >
                            Reuse
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Cannot Reuse</span>
                        )}
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
