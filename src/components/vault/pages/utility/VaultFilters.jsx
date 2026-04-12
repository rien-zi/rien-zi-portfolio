import React, { useState, useEffect, useRef } from "react";
import { GrFormViewHide, GrFormView } from "react-icons/gr";

const Multi = ({ label, options, selected, setSelected }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const toggle = (val) => {
    if (selected.includes(val)) {
      setSelected(selected.filter((v) => v !== val));
    } else {
      setSelected([...selected, val]);
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const filteredOptions = options
    .filter((o) => !selected.includes(o))
    .filter((o) => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref}>
      <p className="text-[11px] text-[var(--text-muted)] mb-1">{label}</p>

      <div className="border border-[var(--border-primary)] rounded p-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((s) => (
            <span
              key={s}
              className="px-2 py-[2px] text-[10px] bg-[var(--accent)] text-white rounded"
            >
              {s}
            </span>
          ))}
        </div>

        <div
          onClick={() => setOpen(true)}
          className="ui-input text-[11px] py-1 cursor-pointer"
        >
          Select {label}
        </div>

        {open && (
          <div className="mt-2 border rounded p-2 bg-[var(--bg-primary)]">
            <input
              className="ui-input w-full mb-2 text-[11px] py-1"
              placeholder={`Search ${label}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="max-h-[120px] overflow-y-auto">
              {filteredOptions.map((o) => (
                <div
                  key={o}
                  onClick={() => toggle(o)}
                  className="px-2 py-1 text-[11px] cursor-pointer hover:bg-[var(--hover-bg)]"
                >
                  {o}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VaultFilters = ({
  categories,
  statusOptions,
  priorityOptions,
  filters,
  setFilters,
  onApply,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [preset, setPreset] = useState("");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const hasFilters =
    localFilters.category.length ||
    localFilters.status.length ||
    localFilters.priority.length ||
    preset;

  return (
    <div className="glass p-3">
      {/* HEADER */}
      <div
        onClick={() => setCollapsed((p) => !p)}
        className="flex justify-between items-center cursor-pointer mb-2"
      >
        <h3 className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
          Filters
        </h3>
        <span className="text-xs">{collapsed ? <GrFormView /> : <GrFormViewHide />}</span>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {/* PRESET */}
          <select
            className="ui-input text-[11px] py-1  w-full"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            <option value="">Preset</option>
            <option value="is_new">Is New</option>
            <option value="is_read">Is Read</option>
          </select>

          <Multi
            label="Category"
            options={categories}
            selected={localFilters.category}
            setSelected={(v) =>
              setLocalFilters({ ...localFilters, category: v })
            }
          />

          <Multi
            label="Status"
            options={statusOptions}
            selected={localFilters.status}
            setSelected={(v) => setLocalFilters({ ...localFilters, status: v })}
          />

          <Multi
            label="Priority"
            options={priorityOptions}
            selected={localFilters.priority}
            setSelected={(v) =>
              setLocalFilters({ ...localFilters, priority: v })
            }
          />

          {/* ACTIONS */}
          <div className="flex gap-2 justify-around pt-2">
            <button
              disabled={!hasFilters}
              onClick={() => {
                const cleared = { category: [], status: [], priority: [] };

                setLocalFilters(cleared);
                setFilters(cleared);
                setPreset("");

                // 🔥 CRITICAL FIX
                onApply && onApply(cleared);
              }}
              className="ui-button-secondary text-[11px] px-2 py-1 disabled:opacity-40"
            >
              Clear
            </button>

            <button
              onClick={() => {
                setFilters(localFilters);
                onApply && onApply(localFilters);
              }}
              className="ui-button-primary text-[11px] px-2 py-1"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultFilters;
