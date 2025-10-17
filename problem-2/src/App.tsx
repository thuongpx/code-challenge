import React, { useState } from "react";
import "./App.css";
import CurrencyItem from "./components/CurrencyItem";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useFetchCurrency } from "./hooks/useFetchCurrency";

interface CurrencyProps {
  currency: string;
  price: number;
}

interface conversionProps {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

function App() {
  const [conversion, setConversion] = useState<conversionProps>({
    fromCurrency: "USD",
    toCurrency: "BUSD",
    amount: 1,
  });

  const { data } = useFetchCurrency(
    "https://interview.switcheo.com/prices.json"
  );

  const handleChangeAmount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setConversion((prev) => {
      if (name === "amount") {
        const numValue = parseFloat(value);
        return {
          ...prev,
          amount: isNaN(numValue) ? 0 : numValue,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const convertedValue = () => {
    let newData: Record<string, number> = {};

    if (data) {
      newData = Object.fromEntries(
        data.map((item: CurrencyProps) => [item.currency, item.price])
      );
    }

    const { fromCurrency, toCurrency, amount } = conversion;

    const fromPrice = newData[fromCurrency];
    const toPrice = newData[toCurrency];

    if (amount === 0) {
      return 0;
    }

    if (amount > 0 && fromPrice != null && toPrice != null && toPrice !== 0) {
      const result = amount * (fromPrice / toPrice);
      return result;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto bg-white">
      <div className="w-[60%] shadow-2xl shadow-gray-400 h-screen ">
        <h1 className="font-bold text-2xl text-purple-400">
          Problem 2: Currency swap
        </h1>
        <div className="flex flex-col">
          <div className="flex flex-col items-start w-[90%] mx-auto gap-3 min-h-[80px] mt-10 rounded-xl">
            <span className="font-medium text-gray-800">Amount to Convert</span>
            <div className="flex border-1 border-gray-300 w-full rounded-[5px]">
              <input
                type="text"
                className="py-2 w-full px-3 focus: outline-none"
                name="amount"
                value={conversion.amount}
                onChange={handleChangeAmount}
              />
            </div>
          </div>
          <CurrencyItem
            label={"From Currency"}
            value={conversion.fromCurrency}
            nameSelected={"fromCurrency"}
            onChange={handleChangeAmount}
            data={data}
          />
          <div className="flex items-center justify-center mt-5">
            <AiOutlineArrowDown size={40} color="" />
          </div>
          <CurrencyItem
            label={"To Currency"}
            value={conversion.toCurrency}
            nameSelected={"toCurrency"}
            onChange={handleChangeAmount}
            data={data}
          />
          <div className="my-5">
            -----------------------------------------------------------------------------------
          </div>
          <h1 className="flex text-start ml-8 font-bold text-2xl mb-4">
            Conversion Result:
          </h1>
          <div className="flex flex-col items-center justify-center bg-blue-500 w-[90%] mx-auto min-h-[100px] py-4 rounded-2xl">
            <span className="text-white font-bold text-2xl">
              {conversion.amount +
                " " +
                conversion.fromCurrency +
                " = " +
                convertedValue()?.toLocaleString() +
                " " +
                conversion.toCurrency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
