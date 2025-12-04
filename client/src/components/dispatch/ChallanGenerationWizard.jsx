import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import ExtraItemsSelector from "./ExtraItemsSelector";

const ChallanGenerationWizard = ({ order, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const totalOrderQty = order?.products.reduce((acc, p) => acc + p.boxes, 0) || 0;
  
  const [wizardData, setWizardData] = useState({
    extraItems: [],
    splitInfo: {
      numberOfChallans: 1,
      quantities: [totalOrderQty],
    },
    scheduledDates: [""],
    deliveryChoice: "homeDelivery",
    shippingAddress: {
      address: order?.user?.customerDetails?.address || "",
      city: order?.user?.customerDetails?.city || "",
      state: order?.user?.customerDetails?.state || "",
      pinCode: order?.user?.customerDetails?.pinCode || "",
    },
    vehicleDetails: [
      {
        vehicleNo: "",
        driverName: "",
        mobileNo: order?.user?.customerDetails?.phone || "",
      },
    ],
    receiverName: order?.firmName || order?.user?.name || "",
  });

  const [quantityWarning, setQuantityWarning] = useState("");

  const steps = [
    { title: "Extra Products", description: "Add extra products (optional)" },
    { title: "Challan Generation", description: "Split order & delivery details" },
  ];

  useEffect(() => {
    validateQuantities();
  }, [wizardData.splitInfo.quantities]);

  const validateQuantities = () => {
    const { quantities } = wizardData.splitInfo;
    const total = quantities.reduce((acc, qty) => acc + (qty || 0), 0);
    
    if (total !== totalOrderQty) {
      setQuantityWarning(`Total quantity must equal ${totalOrderQty}. Current total: ${total}`);
      return false;
    }
    
    setQuantityWarning("");
    return true;
  };

  const handleNumberOfChallansChange = (num) => {
    const currentQuantities = [...wizardData.splitInfo.quantities];
    const currentDates = [...wizardData.scheduledDates];
    const currentVehicles = [...wizardData.vehicleDetails];

    let newQuantities = [];
    let newDates = [];
    let newVehicles = [];

    if (num > currentQuantities.length) {
      newQuantities = [...currentQuantities, ...Array(num - currentQuantities.length).fill(0)];
      newDates = [...currentDates, ...Array(num - currentDates.length).fill("")];
      newVehicles = [
        ...currentVehicles,
        ...Array(num - currentVehicles.length).fill({
          vehicleNo: "",
          driverName: "",
          mobileNo: order?.user?.customerDetails?.phone || "",
        }),
      ];
    } else {
      newQuantities = currentQuantities.slice(0, num);
      newDates = currentDates.slice(0, num);
      newVehicles = currentVehicles.slice(0, num);
    }

    const filledQty = newQuantities.slice(0, num - 1).reduce((acc, qty) => acc + (qty || 0), 0);
    newQuantities[num - 1] = Math.max(totalOrderQty - filledQty, 0);

    setWizardData({
      ...wizardData,
      splitInfo: {
        numberOfChallans: num,
        quantities: newQuantities,
      },
      scheduledDates: newDates,
      vehicleDetails: newVehicles,
    });
  };

  const handleQuantityChange = (index, value) => {
    const numValue = parseInt(value) || 0;
    const newQuantities = [...wizardData.splitInfo.quantities];
    const numberOfChallans = wizardData.splitInfo.numberOfChallans;

    if (index < numberOfChallans - 1) {
      const otherQuantities = newQuantities
        .slice(0, numberOfChallans - 1)
        .map((q, i) => (i === index ? numValue : q || 0));
      
      const filledQty = otherQuantities.reduce((acc, qty) => acc + qty, 0);

      if (filledQty > totalOrderQty) {
        toast.error(`Total quantity cannot exceed ${totalOrderQty}`);
        return;
      }

      newQuantities[index] = numValue;
      newQuantities[numberOfChallans - 1] = totalOrderQty - filledQty;
    } else {
      newQuantities[index] = numValue;
    }

    setWizardData({
      ...wizardData,
      splitInfo: {
        ...wizardData.splitInfo,
        quantities: newQuantities,
      },
    });
  };

  const handleVehicleChange = (index, field, value) => {
    const newVehicles = [...wizardData.vehicleDetails];
    newVehicles[index] = {
      ...newVehicles[index],
      [field]: value,
    };

    setWizardData({
      ...wizardData,
      vehicleDetails: newVehicles,
    });
  };

  const handleDateChange = (index, value) => {
    const newDates = [...wizardData.scheduledDates];
    newDates[index] = value;

    setWizardData({
      ...wizardData,
      scheduledDates: newDates,
    });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!validateQuantities()) {
        toast.error("Please ensure total quantity matches order quantity");
        return false;
      }

      const emptyDate = wizardData.scheduledDates.some((date) => !date);
      if (emptyDate) {
        toast.error("Please select delivery date for all challans");
        return false;
      }

      const emptyVehicle = wizardData.vehicleDetails.some(
        (v) => !v.vehicleNo || !v.driverName || !v.mobileNo
      );
      if (emptyVehicle) {
        toast.error("Please fill vehicle details for all challans");
        return false;
      }

      if (!wizardData.receiverName.trim()) {
        toast.error("Please enter receiver name");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    const formattedData = {
      splitInfo: wizardData.splitInfo,
      extraItems: wizardData.extraItems,
      scheduledDates: wizardData.scheduledDates.map(date => new Date(date).toISOString()),
      deliveryChoice: wizardData.deliveryChoice,
      shippingAddress: wizardData.shippingAddress,
      vehicleDetails: wizardData.vehicleDetails,
      receiverName: wizardData.receiverName,
    };

    onSuccess(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Challan Generation Wizard</h2>
          <p className="text-blue-100">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="px-6 pt-6">
          <div className="flex justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                    idx <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="text-xs text-center text-gray-600">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 min-h-[400px]">
          {currentStep === 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Add Extra Products (Optional)</h3>
              <ExtraItemsSelector
                selectedItems={wizardData.extraItems}
                onItemsChange={(items) =>
                  setWizardData({ ...wizardData, extraItems: items })
                }
              />
              <p className="text-sm text-gray-500 mt-4">
                You can skip this step if you don't want to add extra products.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Challan Generation</h3>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Number of Challans
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={wizardData.splitInfo.numberOfChallans}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 1;
                      handleNumberOfChallansChange(num);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total order quantity: {totalOrderQty} boxes
                  </p>
                </div>

                {quantityWarning && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md flex items-center gap-2">
                    <FaExclamationTriangle className="text-yellow-600" />
                    <span className="text-sm text-yellow-800">{quantityWarning}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {Array.from({ length: wizardData.splitInfo.numberOfChallans }).map((_, idx) => {
                    const isLastRow = idx === wizardData.splitInfo.numberOfChallans - 1;
                    
                    return (
                      <div
                        key={idx}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Challan {idx + 1}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Quantity (Boxes) {isLastRow && "(Auto-calculated)"}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={wizardData.splitInfo.quantities[idx] || ""}
                              onChange={(e) => handleQuantityChange(idx, e.target.value)}
                              disabled={isLastRow}
                              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                isLastRow ? "bg-gray-100 cursor-not-allowed" : ""
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Delivery Date
                            </label>
                            <input
                              type="date"
                              value={wizardData.scheduledDates[idx] || ""}
                              onChange={(e) => handleDateChange(idx, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Driver Name
                            </label>
                            <input
                              type="text"
                              value={wizardData.vehicleDetails[idx]?.driverName || ""}
                              onChange={(e) =>
                                handleVehicleChange(idx, "driverName", e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Vehicle Number
                            </label>
                            <input
                              type="text"
                              value={wizardData.vehicleDetails[idx]?.vehicleNo || ""}
                              onChange={(e) =>
                                handleVehicleChange(idx, "vehicleNo", e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              value={wizardData.vehicleDetails[idx]?.mobileNo || ""}
                              onChange={(e) =>
                                handleVehicleChange(idx, "mobileNo", e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {isLastRow && (
                          <p className="text-xs text-blue-600 mt-2">
                            ℹ️ This quantity is automatically calculated as the remaining balance
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <label className="block text-sm text-gray-700 font-medium mb-1">
                    Receiver Name
                  </label>
                  <input
                    type="text"
                    value={wizardData.receiverName}
                    onChange={(e) =>
                      setWizardData({ ...wizardData, receiverName: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 px-6 py-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center gap-2"
              >
                <FaArrowLeft /> Previous
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!!quantityWarning}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaCheck /> Generate Challans
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallanGenerationWizard;