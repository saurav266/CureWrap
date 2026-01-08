// utilis/shipRocketStatusMap.js
export default function shipRocketStatusMap(status = "") {
  const s = status.toLowerCase();

  if (s.includes("pickup")) return "packed";
  if (s.includes("in transit")) return "shipped";
  if (s.includes("out for delivery")) return "out_for_delivery";
  if (s.includes("delivered")) return "delivered";

  // 🚚 RTO / Undelivered cases
  if (
    s.includes("rto") ||
    s.includes("undelivered") ||
    s.includes("delivery failed")
  ) {
    return "cancelled"; // logical end state
  }

  if (s.includes("cancel")) return "cancelled";

  return null;
}
