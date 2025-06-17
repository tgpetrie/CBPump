import React, { useEffect, useState } from "react";
import '../index.css';
import logobro from './logobro.png';

const formatDecimal = (value, decimals = 2) => {
  // Add proper null/undefined checking
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

const StatusBadge = ({ isConnected, lastUpdate }) => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
        isConnected 
          ? 'bg-[#FF5E00]/20 text-[#FF5E00] border border-[#FF5E00]/50 shadow-lg shadow-[#FF5E00]/40' 
          : 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/50 shadow-lg shadow-[#FF3B30]/40'
      }`}>
        <div className={`w-2.5 h-2.5 rounded-full ${
          isConnected ? 'bg-[#FF5E00] animate-pulse shadow-lg shadow-[#FF5E00]/60' : 'bg-[#FF3B30]'
        }`}></div>
        <span>📡</span>
        {isConnected ? 'LIVE' : 'OFFLINE'}
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-[#E0E0E0] tracking-wide">
        <span>🕐</span>
        UPDATED {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  </div>
);

const ContinuousScrollingBanner = ({ data }) => {
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

const CryptoRow = ({ coin, index }) => (
  <tr className="transition-all duration-300 group hover:bg-gray-900/30 hover:shadow-lg hover:shadow-[#9C3391]/30 hover:drop-shadow-lg backdrop-blur-xl">
    <td className="py-5 pl-6 pr-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-black rounded-full shadow-lg bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 backdrop-blur-xl group-hover:shadow-[#9C3391]/40 transition-all duration-300">
          {index + 1}
        </div>
        <a 
          href={`https://www.coinbase.com/price/${coin.symbol.split('-')[0].toLowerCase()}`} 
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-gray-300/90 transition-all duration-300 hover:text-[#00CFFF] hover:shadow-lg hover:shadow-[#9C3391]/30 hover:drop-shadow-lg group-hover:underline tracking-wide"
        >
          {coin.symbol}
        </a>
      </div>
    </td>
    <td className="px-4 py-5 text-right">
      <div className="font-mono text-base font-bold text-gray-200/95">
        {formatCurrency(coin.current)}
      </div>
    </td>
    <td className="py-5 pl-4 pr-6 text-right">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg backdrop-blur-xl border group-hover:shadow-[#9C3391]/40 hover:drop-shadow-lg ${
        (coin.gain || 0) >= 0 
          ? 'bg-gray-900/40 text-[#FF3F7F] border-gray-700/50 shadow-[#FF3F7F]/15 hover:shadow-[#9C3391]/30 hover:bg-gray-800/50' 
          : 'bg-gray-900/40 text-[#FF3B30] border-gray-700/50 shadow-[#FF3B30]/15 hover:shadow-[#9C3391]/30 hover:bg-gray-800/50'
      }`}>
        <span>{(coin.gain || 0) >= 0 ? '📈' : '📉'}</span>
        {(coin.gain || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.gain || 0))}%
      </div>
    </td>
  </tr>
);

const CryptoTable = ({ title, data, variant = "default" }) => (
  <div className="overflow-hidden border shadow-2xl bg-gradient-to-br from-gray-950/90 via-black/95 to-gray-950/90 backdrop-blur-3xl rounded-3xl border-gray-800/50 shadow-black/70 hover:shadow-[#9C3391]/50 hover:shadow-2xl transition-all duration-500 relative group">
    {/* Glossy overlay effect */}
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/3 via-transparent to-black/30 rounded-3xl"></div>
    
    <div className={`relative px-6 py-5 border-b border-gray-800/40 backdrop-blur-xl ${
      variant === "gainers" ? "bg-gradient-to-r from-[#FF3F7F]/15 via-black/30 to-transparent" : 
      variant === "losers" ? "bg-gradient-to-r from-[#FF3B30]/15 via-black/30 to-transparent" : "bg-gradient-to-r from-gray-900/30 via-black/20 to-gray-900/30"
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {variant === "gainers" && '🚀'}
          {variant === "losers" && '📉'}
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-wide uppercase text-gray-200/95">{title}</h2>
          <p className="text-sm text-gray-400/80 mt-0.5 tracking-wide">3-MINUTE PERFORMANCE RANKINGS</p>
        </div>
      </div>
    </div>
    
    <div className="relative overflow-x-auto backdrop-blur-2xl">
      <table className="w-full">
        <thead className="bg-gray-950/60 backdrop-blur-xl">
          <tr>
            <th className="py-4 pl-6 pr-4 text-xs font-bold tracking-wider text-left uppercase text-gray-400/90">
              Asset
            </th>
            <th className="px-4 py-4 text-xs font-bold tracking-wider text-right uppercase text-gray-400/90">
              Price
            </th>
            <th className="py-4 pl-4 pr-6 text-xs font-bold tracking-wider text-right uppercase text-gray-400/90">
              3min Change
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/30">
          {data.map((coin, index) => 
            <CryptoRow key={coin.symbol} coin={coin} index={index} />
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const TopMoversBar = ({ data }) => {
  // Countdown timer state (30 seconds, resets on each refresh)
  const [secondsLeft, setSecondsLeft] = React.useState(29);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 29));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Defensive: fallback to empty array if data is not an array
  const coins = Array.isArray(data) ? data : [];

  return (
    <div className="w-full overflow-hidden whitespace-nowrap select-none relative group" style={{minHeight: '56px'}}>
      <div className="flex items-center gap-8 animate-marquee px-2 py-2 text-base font-bold text-gray-100/95 tracking-wide">
        {coins.map((coin, idx) => (
          <div key={coin.symbol} className="inline-flex items-center gap-2 px-4 py-1 rounded-xl bg-gray-900/30 shadow-lg shadow-[#9C3391]/10 hover:shadow-[#9C3391]/30 hover:drop-shadow-lg transition-all duration-300">
            <span className="font-mono text-gray-300/90">{coin.symbol}</span>
            <span className="font-mono text-gray-200/95">{formatCurrency(coin.current_price)}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
              (Number(coin.price_change_1h) || 0) >= 0
                ? 'bg-[#FF3F7F]/20 text-[#FF3F7F]' 
                : 'bg-[#FF3B30]/20 text-[#FF3B30]'
            }`}>
              {(Number(coin.price_change_1h) || 0) >= 0 ? '📈' : '📉'}
              {(Number(coin.price_change_1h) || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(Number(coin.price_change_1h) || 0))}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [top24h, setTop24h] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    console.log('🚀 CBMo4ers App useEffect started!');
    console.log('🚀 Environment object:', import.meta.env);
    console.log('🚀 VITE_API_URL value:', import.meta.env.VITE_API_URL);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    console.log('🚀 Final apiUrl:', apiUrl);
    
    const fetchCryptoData = async () => {
      console.log('🔄 fetchCryptoData function called at:', new Date().toISOString());
      console.log('🔄 Fetching from URL:', `${apiUrl}/api/crypto`);
      
      try {
        // Test health endpoint first
        console.log('🔄 Testing health endpoint...');
        const healthResponse = await fetch(`${apiUrl}/api/health`);
        console.log('📊 Health response status:', healthResponse.status);
        console.log('📊 Health response ok:', healthResponse.ok);
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('✅ Health data:', healthData);
        }
        
        // Fetch main crypto data
        console.log('🔄 Fetching crypto data...');
        const cryptoResponse = await fetch(`${apiUrl}/api/crypto`);
        console.log('📊 Crypto response status:', cryptoResponse.status);
        console.log('📊 Crypto response ok:', cryptoResponse.ok);
        
        if (!cryptoResponse.ok) {
          throw new Error(`Crypto API returned status ${cryptoResponse.status}`);
        }
        
        const cryptoData = await cryptoResponse.json();
        console.log('✅ Crypto data structure:', Object.keys(cryptoData));
        console.log('✅ Gainers count:', cryptoData.gainers?.length || 0);
        console.log('✅ Losers count:', cryptoData.losers?.length || 0);
        console.log('✅ Top24h count:', cryptoData.top24h?.length || 0);
        
        // Fetch banner data
        console.log('🔄 Fetching banner data...');
        const bannerResponse = await fetch(`${apiUrl}/api/banner-1h`);
        console.log('📊 Banner response status:', bannerResponse.status);
        
        if (!bannerResponse.ok) {
          throw new Error(`Banner API returned status ${bannerResponse.status}`);
        }
        
        const bannerDataResp = await bannerResponse.json();
        console.log('✅ Banner data structure:', Object.keys(bannerDataResp));
        console.log('✅ Banner array length:', bannerDataResp.banner?.length || 0);
        
        // Update state
        console.log('🔄 Updating React state...');
        setGainers(cryptoData.gainers || []);
        setLosers(cryptoData.losers || []);
        setTop24h(cryptoData.top24h || []);
        setBannerData(bannerDataResp.banner || []);
        setLastUpdate(new Date());
        setIsConnected(true);
        
        console.log('🎉 All data loaded and state updated successfully!');
        
      } catch (error) {
        console.error('❌ Error in fetchCryptoData:', error.message);
        console.error('❌ Full error object:', error);
        console.error('❌ Error stack:', error.stack);
        setIsConnected(false);
      }
    };

    console.log('🔄 About to call fetchCryptoData for the first time...');
    fetchCryptoData();
    
    console.log('🔄 Setting up interval for polling...');
    const interval = setInterval(() => {
      console.log('🔄 Interval triggered, calling fetchCryptoData...');
      fetchCryptoData();
    }, 5000); // 5 seconds
    
    return () => {
      console.log('🔄 Cleaning up interval...');
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black relative">
      {/* 1h Change label above TopMoversBar */}
      <div className="absolute left-8 top-24 z-50">
        <span className="px-4 py-1 text-xs font-bold tracking-wider uppercase text-pink-400 bg-black/40 rounded-xl border border-pink-400/10 shadow-none" style={{letterSpacing: '0.1em'}}>1h Change</span>
      </div>
      {/* Countdown timer in very top right */}
      <div className="fixed top-4 right-8 z-50 text-xs font-mono font-bold text-gray-400/30 tracking-widest select-none pointer-events-none" style={{letterSpacing: '0.1em'}}>
        <CountdownTimer />
      </div>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b shadow-2xl bg-black/98 backdrop-blur-2xl border-gray-900/80 shadow-black/60">
        <div className="px-6 py-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center group">
            <img 
              src={logobro} 
              alt="Logo" 
              className="h-56 w-auto bg-transparent animate-fade-in-up transition-all duration-300"
              style={{ filter: "none", transition: "filter 0.3s" }}
              onMouseOver={e => e.currentTarget.style.filter = "drop-shadow(0 0 40px #ec4899)"}
              onMouseOut={e => e.currentTarget.style.filter = "none"}
            />
            <p className="mt-6 text-xl font-medium text-[#E0E0E0] tracking-wide animate-fade-in-up text-center">REAL-TIME CRYPTOCURRENCY MARKET DATA</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10 mx-auto space-y-10 max-w-7xl">
        {/* Top Movers Section */}
        <section className="mt-16 animate-fade-in-up">
          {/* Pass correct 1h data to TopMoversBar */}
          <TopMoversBar data={bannerData} />
        </section>

        {/* Tables Grid */}
        <section className="grid gap-8 lg:grid-cols-2 animate-fade-in-up">
          <CryptoTable 
            title="Top Gainers" 
            data={gainers} 
            variant="gainers"
          />
          <CryptoTable 
            title="Top Losers" 
            data={losers} 
            variant="losers"
          />
        </section>

        {/* Scrolling Banner Section */}
        <section className="animate-fade-in-up">
          {/* Pass correct 1h volume change data to ContinuousScrollingBanner */}
          <ContinuousScrollingBanner data={bannerData} />
        </section>

        <footer className="py-12 mt-20 text-center border-t border-gray-800/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium tracking-wider uppercase text-gray-400/90">
              Copyright 2025 GUISAN DESIGN - TOM PETRIE - BHABIT
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// CountdownTimer component for global timer
function CountdownTimer() {
  const [secondsLeft, setSecondsLeft] = React.useState(29);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 29));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <span>{secondsLeft}</span>;
}
