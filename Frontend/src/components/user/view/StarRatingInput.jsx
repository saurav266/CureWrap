// src/components/product/StarRatingInput.jsx
export default function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`text-2xl ${
            s <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
