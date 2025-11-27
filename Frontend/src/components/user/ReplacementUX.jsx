import React, { useState } from "react";

export default function ReplacementModal({ orderId, item, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);

  const submit = async () => {
    const body = { orderId, productId: item.product, reason, images };
    const res = await fetch("http://localhost:8000/api/replacement/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else alert("Request Failed");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-xl w-[380px] space-y-3">
        <h2 className="text-lg font-semibold">Replacement Request</h2>

        <label className="text-sm font-medium">Reason</label>
        <select className="w-full p-2 border rounded" value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">Choose</option>
          <option>Wrong Size</option>
          <option>Damaged Product</option>
          <option>Not as Shown</option>
          <option>Poor Quality</option>
        </select>

        <button className="w-full py-2 bg-gray-200 rounded" onClick={() => alert("Integrate image upload")}>
          Upload Proof Images
        </button>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 border rounded">
            Cancel
          </button>
          <button onClick={submit} disabled={!reason} className="flex-1 py-2 bg-green-600 text-white rounded font-semibold">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
