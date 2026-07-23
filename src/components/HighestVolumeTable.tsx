import React, { useState } from 'react';
import { StockSymbol } from '../types';

interface HighestVolumeTableProps {
  stocks: StockSymbol[];
  onSelectSymbol: (symbol: StockSymbol) => void;
  onSeeAll: () => void;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'rawVolume';

export const HighestVolumeTable: React.FC<HighestVolumeTableProps> = ({
  stocks,
  onSelectSymbol,
  onSeeAll,
}) => {
  const [sortField, setSortField] = useState<SortField>('rawVolume');
  const [sortAsc, setSortAsc] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.name.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField] ?? 0;
    let valB = b[sortField] ?? 0;
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <section className="py-8 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#181c21]">
            Highest volume stocks
          </h2>
          <p className="text-xs text-[#737687] mt-1 font-body">
            Real-time active securities ranked by trading volume
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Filter table..."
            className="px-3 py-1 bg-[#f1f4fb] border border-[#E0E3EB] rounded text-xs font-mono-data focus:outline-none focus:border-[#0049db]"
          />
          <button
            onClick={onSeeAll}
            className="text-[#0049db] font-mono-data text-xs md:text-sm font-medium flex items-center gap-1 hover:underline group whitespace-nowrap"
          >
            See all most active
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* Table Box */}
      <div className="bg-[#FFFFFF] border border-[#E0E3EB] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FB] border-b border-[#E0E3EB]">
              <tr>
                <th
                  onClick={() => handleSort('symbol')}
                  className="px-6 py-3 font-mono-data text-xs text-[#737687] font-semibold cursor-pointer hover:text-[#181c21] select-none"
                >
                  <div className="flex items-center gap-1">
                    Symbol
                    {sortField === 'symbol' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAsc ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="px-6 py-3 font-mono-data text-xs text-[#737687] font-semibold cursor-pointer hover:text-[#181c21] select-none"
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortField === 'price' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAsc ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="px-6 py-3 font-mono-data text-xs text-[#737687] font-semibold cursor-pointer hover:text-[#181c21] select-none"
                >
                  <div className="flex items-center gap-1">
                    Chg %
                    {sortField === 'changePercent' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAsc ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rawVolume')}
                  className="px-6 py-3 font-mono-data text-xs text-[#737687] font-semibold text-right cursor-pointer hover:text-[#181c21] select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    Volume
                    {sortField === 'rawVolume' && (
                      <span className="material-symbols-outlined text-xs">
                        {sortAsc ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E0E3EB]">
              {sorted.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <tr
                    key={item.symbol}
                    onClick={() => onSelectSymbol(item)}
                    className="hover:bg-[#f1f4fb] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data text-xs md:text-sm font-bold text-[#0049db] group-hover:underline">
                          {item.symbol}
                        </span>
                        <span className="font-body text-xs text-[#6A6D78] truncate hidden md:inline max-w-[240px]">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono-data text-xs md:text-sm font-semibold text-[#181c21]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`px-6 py-4 font-mono-data text-xs md:text-sm font-semibold ${
                        isUp ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 font-mono-data text-xs md:text-sm text-[#181c21] text-right">
                      {item.volume}
                    </td>
                  </tr>
                );
              })}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-xs font-mono-data text-[#737687]">
                    No stocks matching "{tableSearch}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
