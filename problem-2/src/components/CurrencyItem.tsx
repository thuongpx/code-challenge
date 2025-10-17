interface CurrencyProps {
  currency: string;
  price: number;
}

interface CurrencyItemProps {
  label: string;
  value: string;
  nameSelected: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  data: CurrencyProps[];
}

const CurrencyItem = ({
  label,
  value,
  nameSelected,
  data,
  onChange,
}: CurrencyItemProps) => {
  return (
    <div className="flex flex-row items-center w-[90%] mx-auto px-10 gap-6 min-h-[80px] bg-blue-200 mt-5 rounded-xl">
      <p className="font-semibold min-w-[100px]">{label}</p>
      <div className="border-1 rounded-xl border-gray-400 bg-white w-[100px] items-center justify-between">
        <select
          name={nameSelected}
          value={value}
          className="w-[90px] p-2 focus: outline-none"
          onChange={onChange}
        >
          {data &&
            data.map((item) => (
              <option key={item.currency} value={item.currency}>
                {item.currency}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencyItem;
