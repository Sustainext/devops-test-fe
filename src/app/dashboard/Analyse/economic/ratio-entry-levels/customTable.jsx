import React from 'react';

const DynamicTable2 = ({ data, columns }) => {
  // Check if all rows are empty objects
  const isEmptyData = data.every(row => Object.keys(row).length === 0);

  return (
    <div className="">
      <table className="min-w-full w-full rounded-lg border border-gray-300 "style={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <thead className="block md:table-header-group">
          <tr className="md:table-row gradient-background">
            {columns.map((column, index) => (
              <th
                key={column}
                className={`px-2 py-3  text-[#727272]  block md:table-cell text-center text-[12px]  border-gray-300 ${ index===0 ? "":"border-l"} `}
               
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {data.length === 0 || isEmptyData ? (
            <tr className="md:table-row">
              <td
                colSpan={columns.length}
                 className="text-center p-2 block md:table-cell text-[12px] font-normal text-slate-500 border-t border-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="md:table-row">
                {columns.map((column, colIndex) => (
                   <td
                   key={colIndex}
                   className={`p-2 block md:table-cell ${
                    colIndex === 0
                      ? "text-center font-normal text-slate-500"
                      : "text-center font-normal text-slate-500 border-l"
                  } text-[12px] border-gray-300 border-t`}
                 >
                    {row[column] !== undefined && row[column] !== null
                      ? colIndex === 0
                        ? row[column]
                        : `${row[column]}`
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable2;
