import React, { useState } from "react";

const getDecadeStart = (year) => Math.floor(year / 10) * 10;

const YearPicker = ({
  value,
  onChange,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
}) => {
  const initialDecade = getDecadeStart(value || maxYear);
  const [decadeStart, setDecadeStart] = useState(initialDecade);

  // Clamp decadeStart so all years are in range
  const clampDecade = (start) => {
    if (start < getDecadeStart(minYear)) return getDecadeStart(minYear);
    if (start + 8 > maxYear) return getDecadeStart(maxYear - 8);
    return start;
  };

  const handlePrev = () => setDecadeStart((prev) => clampDecade(prev - 10));
  const handleNext = () => setDecadeStart((prev) => clampDecade(prev + 10));

  const years = [];
  for (let y = decadeStart; y <= decadeStart + 8; y++) {
    if (y >= minYear && y <= maxYear) years.push(y);
  }

  return (
    <div className="year-picker-component">
      <div className="year-picker-decade-nav">
        <button
          onClick={handlePrev}
          disabled={decadeStart <= getDecadeStart(minYear)}
        >
          &lt;
        </button>
        <span>
          {years[0]} - {years[years.length - 1]}
        </span>
        <button onClick={handleNext} disabled={decadeStart + 8 >= maxYear}>
          &gt;
        </button>
      </div>
      <div className="year-picker-grid">
        {years.map((year) => (
          <button
            key={year}
            className={`year-btn${value === year ? " selected" : ""}`}
            onClick={() => onChange(year)}
            type="button"
          >
            {year}
          </button>
        ))}
      </div>
      <button
        className="year-btn reset-btn"
        onClick={() => onChange("")}
        type="button"
      >
        Reset
      </button>
    </div>
  );
};

export default YearPicker;
