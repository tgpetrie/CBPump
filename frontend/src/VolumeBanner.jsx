import React from "react";
import '../index.css';

const formatDecimal = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value) || value === '') {
    return '0.00';
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return '0.00';
  }
  return num.toFixed(decimals);
};

const formatCurrency = val => new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD',
  minimumFractionDigits: Math.abs(val) >= 1 ? 2 : 6
}).format(val);

const VolumeBanner = ({ data }) => {
  return (
    <div className="overflow-hidden bg-gradient-to-r from-black/80 via-black/60 to-black/80 rounded-3xl shadow-none border-none backdrop-blur-3xl animate-fade-in-up">
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/20 rounded-3xl"></div>
      <div className="relative px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔥</span>
          <h3 className="text-base font-bold tracking-wide uppercase text-gray-200/90">
            1H Volume Change • Live Market Feed
          </h3>
        </div>
      </div>
      <div className="relative h-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="flex animate-scroll whitespace-nowrap">
            {/* First set of data */}
            {data.map((coin, index) => (
              <div key={`first-${coin.symbol}`} className="flex-shrink-0 mx-8">
                <a 
                  href={`https://www.coinbase.com/price/${coin.symbol.split('-')[0].toLowerCase()}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg rounded-lg px-3 py-2 hover:bg-gray-900/40 backdrop-blur-xl"
                >
                  <div className="text-sm font-bold tracking-wide text-gray-300/90">
                    {coin.symbol}
                  </div>
                  <div className="font-mono text-sm text-gray-100/95">
                    {formatCurrency(coin.current_price)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${
                    (coin.volume_change_1h || 0) >= 0 ? 'text-[#00CFFF]' : 'text-[#FF5E00]'
                  }`}>
                    <span>{(coin.volume_change_1h || 0) >= 0 ? '🚀' : '📉'}</span>
                    1h: {(coin.volume_change_1h || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.volume_change_1h || 0))}%
                  </div>
                  <div className="text-xs text-gray-400">
                    Vol: {formatCurrency(coin.volume_24h || 0)}
                  </div>
                </a>
              </div>
            ))}
            {/* Duplicate set for seamless scrolling */}
            {data.map((coin, index) => (
              <div key={`second-${coin.symbol}`} className="flex-shrink-0 mx-8">
                <a 
                  href={`https://www.coinbase.com/price/${coin.symbol.split('-')[0].toLowerCase()}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg rounded-lg px-3 py-2 hover:bg-gray-900/40 backdrop-blur-xl"
                >
                  <div className="text-sm font-bold tracking-wide text-gray-300/90">
                    {coin.symbol}
                  </div>
                  <div className="font-mono text-sm text-gray-100/95">
                    {formatCurrency(coin.current_price)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${
                    (coin.volume_change_1h || 0) >= 0 ? 'text-[#00CFFF]' : 'text-[#FF5E00]'
                  }`}>
                    <span>{(coin.volume_change_1h || 0) >= 0 ? '🚀' : '📉'}</span>
                    1h: {(coin.volume_change_1h || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.volume_change_1h || 0))}%
                  </div>
                  <div className="text-xs text-gray-400">
                    Vol: {formatCurrency(coin.volume_24h || 0)}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeBanner;
