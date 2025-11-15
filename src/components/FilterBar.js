import React from "react";

const FilterBar = React.memo(function FilterBar({
  filterType,
  setFilterType,
  filterPrice,
  setFilterPrice,
  priceFilterType,
  setPriceFilterType,
  productTypes,
  resetFilters,
}) {
  console.log("FilterBar rendered"); // debug to check

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
      {/* Type Filter */}
      <select
        className="border px-3 py-2 rounded-lg"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="">All Types</option>
        {productTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Price Input */}
      <input
        type="number"
        placeholder="Price"
        className="border px-3 py-2 w-24 rounded-lg"
        value={filterPrice}
        onChange={(e) => setFilterPrice(e.target.value)}
      />

      {/* Price Filter Type */}
      <select
        className="border px-3 py-2 rounded-lg"
        value={priceFilterType}
        onChange={(e) => setPriceFilterType(e.target.value)}
      >
        <option value="less">≤ Price</option>
        <option value="greater">≥ Price</option>
      </select>

      <button onClick={resetFilters} className="border px-4 py-2 rounded-lg">
        Reset
      </button>
    </div>
  );
});

export default FilterBar;
