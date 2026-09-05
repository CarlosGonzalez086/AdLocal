import React from "react";
import { SearchInput } from "../SearchInput";
import { OrderSelect } from "../OrderSelect";
import MaterialSymbol from "./MaterialSymbol/MaterialSymbol";

interface OrderOption {
  value: string;
  label: string;
}

interface ActionButtonProps {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: "contained" | "outlined";
}

interface SearchToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  orderBy?: string;
  onOrderChange?: (value: string) => void;
  orderOptions?: OrderOption[];
  actionButton?: ActionButtonProps;
  extraFilters?: React.ReactNode;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar registros...",
  orderBy,
  onOrderChange,
  actionButton,
  extraFilters,
}) => {
  return (
    <div className="card-adlocal p-3 mb-4">
      <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-3">
        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 flex-grow-1" style={{ minWidth: 0 }}>
          <div className="flex-grow-1" style={{ minWidth: "220px" }}>
            <SearchInput
              value={search}
              placeholder={searchPlaceholder}
              onChange={onSearchChange}
            />
          </div>

          {orderBy !== undefined && onOrderChange && (
            <div style={{ minWidth: "160px" }}>
              <OrderSelect value={orderBy} onChange={onOrderChange} />
            </div>
          )}

          {extraFilters}
        </div>

        {actionButton && (
          <button
            type="button"
            className={`btn-adlocal ${actionButton.variant === "outlined" ? "btn-adlocal--ghost" : "btn-adlocal--solid"} text-nowrap d-inline-flex align-items-center gap-2`}
            onClick={actionButton.onClick}
          >
            {actionButton.icon && (
              <MaterialSymbol icon={actionButton.icon} size="small" />
            )}
            <span>{actionButton.label}</span>
          </button>
        )}
      </div>
    </div>
  );
};
