import React, { useEffect, useState } from "react";
import logo from "./logobro.png";

export default function App() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [top24h, setTop24h] = useState([]);
  const [volumeBanner, setVolumeBanner] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/data");
        const json = await res.json();
        setGainers(json.gainers || []);
        setLosers(json.losers || []);
        setTop24h(json.top24h || []);
        setVolumeBanner(json.banner || null);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="BHABIT Logo" className="w-24 h-24 sm:w-32 sm:h-32" />
          <h1 className="text-5xl md:text-7xl font-bold text-orange-500 drop-shadow-md">BHABIT</h1>
        </div>
        <p className="mt-2 text-md md:text-xl text-gray-400">Profits Buy Impulse</p>
      </div>
      <div className="overflow-x-auto whitespace-nowrap mb-6 py-2 px-4 bg-gradient-to-r from-purple-800/10 to-blue-800/10 rounded-xl border border-white/5 shadow-sm">
        <h2 className="text-sm uppercase text-purple-300 tracking-wide mb-2">Top 24h Gainers</h2>
        <div className="flex space-x-4">
          {top24h.map((coin, i) => (
            <div key={i} className="px-4 py-2 bg-purple-900/20 rounded-md hover:bg-purple-900/30 transition text-xs">
              <a href={`https://www.coinbase.com/price/${coin.symbol.toLowerCase()}`} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">
                {coin.symbol}
              </a>: {coin.percent_change}%
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 rounded-2xl shadow-inner hover:shadow-md transition">
          <h2 className="text-xl text-orange-400 mb-3">Top Gainers</h2>
          <ul className="space-y-2">
            {gainers.map((coin, i) => (
              <li key={i} className="flex justify-between text-sm text-white/80 hover:text-white">
                <span>#{i + 1} {coin.symbol}</span>
                <span className="text-green-400">+{coin.percent_change}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl shadow-inner hover:shadow-md transition">
          <h2 className="text-xl text-red-400 mb-3">Top Losers</h2>
          <ul className="space-y-2">
            {losers.map((coin, i) => (
              <li key={i} className="flex justify-between text-sm text-white/80 hover:text-white">
                <span>#{i + 1} {coin.symbol}</span>
                <span className="text-red-400">{coin.percent_change}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-white/5 text-sm">
        {volumeBanner ? (
          <p className="text-blue-300">
            Volume (1h ago): ${volumeBanner.past} → Now: ${volumeBanner.current} <span className="text-green-400">({volumeBanner.change}%)</span>
          </p>
        ) : (
          <p className="text-gray-500">Loading volume data...</p>
        )}
      </div>
    </div>
  );
}
