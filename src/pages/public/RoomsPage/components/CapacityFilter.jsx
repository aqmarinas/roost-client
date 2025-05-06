import Input from "@/components/form/input";
import { useState } from "react";

export default function CapacityFilter({ filters, setFilters }) {
  const [errMsg, setErrMsg] = useState("");

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrMsg("");
    } else if (value < 1) {
      setErrMsg("Capacity must be at least 1");
    } else {
      setErrMsg("");
    }
    setFilters((prev) => prev.map((f) => (f.id === "capacity" ? { ...f, value } : f)));
  };

  return (
    <div>
      <p className="font-semibold text-sm">How many people?</p>
      <Input
        id="capacity"
        name="capacity"
        placeholder="5"
        type="number"
        min={1}
        value={filters.find((f) => f.id === "capacity")?.value || ""}
        onChange={handleCapacityChange}
        className="h-10 md:w-[200px]"
      />
      {errMsg && <div className="text-red-500 mt-2 text-sm">{errMsg}</div>}
    </div>
  );
}
