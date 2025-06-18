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

const ContinuousScrollingBanner = ({ data, bannerType = "price" }) => {
  const getBannerTitle = () => {
    switch(bannerType) {
      case "volume": return "Volume Leaders • Live Market Feed";
      case "price": return "Price Movement • Live Market Feed";
      default: return "Live Market Feed";
    }
  };

  const getBannerIcon = () => {
    switch(bannerType) {
      case "volume": return "📊";
      case "price": return "🔥";
      default: return "🚀";
    }
  };

  const renderCoinData = (coin, keyPrefix) => {
    if (bannerType === "volume") {
      return (
        <div key={`${keyPrefix}-${coin.symbol}`} className="flex-shrink-0 mx-8">
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
            <div className="text-xs text-blue-400 font-bold">
              Vol: {formatCurrency(coin.volume_24h || 0)}
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${
              (coin.price_change_1h || 0) >= 0 ? 'text-[#00CFFF]' : 'text-[#FF5E00]'
            }`}>
              <span>{(coin.price_change_1h || 0) >= 0 ? '🚀' : '📉'}</span>
              1h: {(coin.price_change_1h || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.price_change_1h || 0))}%
            </div>
          </a>
        </div>
      );
    } else {
      // Price-focused banner
      return (
        <div key={`${keyPrefix}-${coin.symbol}`} className="flex-shrink-0 mx-8">
          <a 
            href={`https://www.coinbase.com/price/${coin.symbol.split('-')[0].toLowerCase()}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg rounded-lg px-3 py-2 hover:bg-gray-900/40 backdrop-blur-xl"
          >
            <div className="text-sm font-bold tracking-wide text-gray-300/90">
              {coin.symbol}
            </div>
            <div className="font-mono text-lg text-gray-100/95 font-bold">
              {formatCurrency(coin.current_price)}
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${
              (coin.price_change_1h || 0) >= 0 ? 'text-[#00CFFF]' : 'text-[#FF5E00]'
            }`}>
              <span>{(coin.price_change_1h || 0) >= 0 ? '🚀' : '📉'}</span>
              1h: {(coin.price_change_1h || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.price_change_1h || 0))}%
            </div>
            {coin.price_change_24h && (
              <div className={`text-xs ${
                (coin.price_change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                24h: {(coin.price_change_24h || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.price_change_24h || 0))}%
              </div>
            )}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="overflow-hidden bg-gradient-to-r from-black/80 via-black/60 to-black/80 rounded-3xl shadow-none border-none backdrop-blur-3xl animate-fade-in-up">
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/20 rounded-3xl"></div>
      <div className="relative px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{getBannerIcon()}</span>
          <h3 className="text-base font-bold tracking-wide uppercase text-gray-200/90">
            {getBannerTitle()}
          </h3>
        </div>
      </div>
      <div className="relative h-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="flex animate-scroll whitespace-nowrap">
            {/* First set of data */}
            {data.map((coin, index) => renderCoinData(coin, "first"))}
            {/* Duplicate set for seamless scrolling */}
            {data.map((coin, index) => renderCoinData(coin, "second"))}
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
          {coin.rank || index + 1}
        </div>
        <a 
          href={`https://www.coinbase.com/price/${coin.symbol.split('-')[0].toLowerCase()}`} 
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-gray-300/90 transition-all duration-300 hover:text-[#00CFFF] hover:shadow-lg hover:shadow-[#9C3391]/30 hover:drop-shadow-lg group-hover:underline tracking-wide"
        >
          {coin.symbol}
        </a>
        {/* Show momentum indicator if available */}
        {coin.momentum && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            coin.momentum === 'strong' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600/20 text-gray-400'
          }`}>
            {coin.momentum}
          </span>
        )}
        {/* Show alert level if high */}
        {coin.alert_level === 'high' && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-400/20 text-red-400 animate-pulse">
            🚨 HIGH
          </span>
        )}
      </div>
    </td>
    <td className="px-4 py-5 text-right">
      <div className="font-mono text-base font-bold text-gray-200/95">
        {formatCurrency(coin.current_price || coin.current || 0)}
      </div>
      {/* Show actual interval if available */}
      {coin.actual_interval_minutes && (
        <div className="text-xs text-gray-500">
          {formatDecimal(coin.actual_interval_minutes)}min data
        </div>
      )}
    </td>
    <td className="py-5 pl-4 pr-6 text-right">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-xl border group-hover:shadow-[#9C3391]/40 hover:drop-shadow-lg ${
        (coin.price_change_percentage_3min || coin.gain || 0) >= 0 
          ? 'bg-gray-900/40 text-[#FF3F7F] border-gray-700/50 shadow-[#FF3F7F]/15 hover:shadow-[#9C3391]/30 hover:bg-gray-800/50' 
          : 'bg-gray-900/40 text-[#FF3B30] border-gray-700/50 shadow-[#FF3B30]/15 hover:shadow-[#9C3391]/30 hover:bg-gray-800/50'
      }`}>
        <span>{(coin.price_change_percentage_3min || coin.gain || 0) >= 0 ? '📈' : '📉'}</span>
        {(coin.price_change_percentage_3min || coin.gain || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(coin.price_change_percentage_3min || coin.gain || 0))}%
      </div>
    </td>
  </tr>
);

const CryptoTable = ({ title, data, variant = "default", componentStatus }) => (
  <div className="overflow-hidden border shadow-2xl bg-gradient-to-br from-gray-950/90 via-black/95 to-gray-950/90 backdrop-blur-3xl rounded-3xl border-gray-800/50 shadow-black/70 hover:shadow-[#9C3391]/50 hover:shadow-2xl transition-all duration-500 relative group">
    {/* Glossy overlay effect */}
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/3 via-transparent to-black/30 rounded-3xl"></div>
    
    <div className={`relative px-6 py-5 border-b border-gray-800/40 backdrop-blur-xl ${
      variant === "gainers" ? "bg-gradient-to-r from-[#FF3F7F]/15 via-black/30 to-transparent" : 
      variant === "losers" ? "bg-gradient-to-r from-[#FF3B30]/15 via-black/30 to-transparent" : "bg-gradient-to-r from-gray-900/30 via-black/20 to-gray-900/30"
    }`}>
      <div className="flex items-center justify-between">
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
        {/* Component Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            componentStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`} />
          <span className="text-xs text-gray-400">
            {componentStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
          </span>
          <span className="text-xs text-gray-500">
            {data.length} items
          </span>
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
  const [secondsLeft, setSecondsLeft] = React.useState(29);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 29));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const coins = Array.isArray(data) ? data : [];
  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap select-none relative group"
      style={{ minHeight: '56px' }}
    >
      <div className="flex items-center gap-8 animate-marquee px-2 py-2 text-base font-bold text-gray-100/95 tracking-wide">
        {coins.map((coin, idx) => (
          <div key={coin.symbol} className="inline-flex items-center gap-3 px-4 py-1 rounded-xl bg-gray-900/30 shadow-lg shadow-[#9C3391]/10 hover:shadow-[#9C3391]/30 hover:drop-shadow-lg transition-all duration-300">
            <span className="font-mono text-gray-300/90">{coin.symbol}</span>
            <span className="font-mono text-gray-200/95 text-lg">{formatCurrency(coin.current_price || coin.current || 0)}</span>
            {/* 3-minute change for top movers bar */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold text-sm ${
              (Number(coin.price_change_3min) || Number(coin.gain) || 0) >= 0
                ? 'bg-[#FF3F7F]/20 text-[#FF3F7F]'
                : 'bg-[#FF3B30]/20 text-[#FF3B30]'
            }`}>
              {(Number(coin.price_change_3min) || Number(coin.gain) || 0) >= 0 ? '📈' : '📉'}
              3min: {(Number(coin.price_change_3min) || Number(coin.gain) || 0) >= 0 ? '+' : ''}{formatDecimal(Math.abs(Number(coin.price_change_3min) || Number(coin.gain) || 0))}%
            </span>
            {/* Show momentum if available */}
            {coin.momentum && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold text-xs ${
                coin.momentum === 'strong' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600/20 text-gray-400'
              }`}>
                {coin.momentum}
              </span>
            )}
            {/* Trending score indicator if available */}
            {coin.trending_score && coin.trending_score > 100 && (
              <span className="text-yellow-400 text-xs">⭐</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  // Individual component state - each component manages its own data
  const [gainersData, setGainersData] = useState([]);
  const [losersData, setLosersData] = useState([]);
  const [topMoversData, setTopMoversData] = useState([]);
  const [topBannerData, setTopBannerData] = useState([]);
  const [bottomBannerData, setBottomBannerData] = useState([]);
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [componentStatus, setComponentStatus] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

  // Individual fetch functions for each component
  const fetchGainersData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/component/gainers-table`);
      if (response.ok) {
        const data = await response.json();
        setGainersData(data.data || []);
        setComponentStatus(prev => ({ ...prev, gainers: 'connected' }));
        console.log('✅ Gainers data updated:', data.count, 'items');
      }
    } catch (error) {
      console.error('❌ Error fetching gainers:', error);
      setComponentStatus(prev => ({ ...prev, gainers: 'error' }));
    }
  };

  const fetchLosersData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/component/losers-table`);
      if (response.ok) {
        const data = await response.json();
        setLosersData(data.data || []);
        setComponentStatus(prev => ({ ...prev, losers: 'connected' }));
        console.log('✅ Losers data updated:', data.count, 'items');
      }
    } catch (error) {
      console.error('❌ Error fetching losers:', error);
      setComponentStatus(prev => ({ ...prev, losers: 'error' }));
    }
  };

  const fetchTopMoversData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/component/top-movers-bar`);
      if (response.ok) {
        const data = await response.json();
        setTopMoversData(data.data || []);
        setComponentStatus(prev => ({ ...prev, topMovers: 'connected' }));
        console.log('✅ Top movers data updated:', data.count, 'items');
      }
    } catch (error) {
      console.error('❌ Error fetching top movers:', error);
      setComponentStatus(prev => ({ ...prev, topMovers: 'error' }));
    }
  };

  const fetchTopBannerData = async () => {
    try {
      console.log('🔄 Fetching top banner data from:', `${apiUrl}/api/component/top-banner-scroll`);
      const response = await fetch(`${apiUrl}/api/component/top-banner-scroll`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Top banner raw response:', data);
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setTopBannerData(data.data);
          setComponentStatus(prev => ({ ...prev, topBanner: 'connected' }));
          console.log('✅ Top banner data updated:', data.count, 'items');
        } else {
          console.warn('⚠️ Top banner: No data in response:', data);
          setComponentStatus(prev => ({ ...prev, topBanner: 'no-data' }));
        }
      } else {
        console.error('❌ Top banner HTTP error:', response.status, response.statusText);
        setComponentStatus(prev => ({ ...prev, topBanner: 'error' }));
      }
    } catch (error) {
      console.error('❌ Error fetching top banner:', error);
      setComponentStatus(prev => ({ ...prev, topBanner: 'error' }));
    }
  };

  const fetchBottomBannerData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/component/bottom-banner-scroll`);
      if (response.ok) {
        const data = await response.json();
        setBottomBannerData(data.data || []);
        setComponentStatus(prev => ({ ...prev, bottomBanner: 'connected' }));
        console.log('✅ Bottom banner data updated:', data.count, 'items');
      }
    } catch (error) {
      console.error('❌ Error fetching bottom banner:', error);
      setComponentStatus(prev => ({ ...prev, bottomBanner: 'error' }));
    }
  };

  // Initialize all components
  useEffect(() => {
    console.log('🚀 CBMo4ers App with individual components started!');
    
    // Initial fetch for all components
    const initializeComponents = async () => {
      // Test health first
      try {
        const healthResponse = await fetch(`${apiUrl}/api/health`);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('✅ Health check passed:', healthData.status);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('❌ Health check failed:', error);
        setIsConnected(false);
      }

      // Fetch all component data
      await Promise.all([
        fetchGainersData(),
        fetchLosersData(), 
        fetchTopMoversData(),
        fetchTopBannerData(),
        fetchBottomBannerData()
      ]);
      
      setLastUpdate(new Date());
    };

    initializeComponents();
  }, []);

  // Set up different update intervals for each component based on their needs
  useEffect(() => {
    // Gainers/Losers: Update every 3 minutes (reduce frequency to prevent glitchy animations)
    const gainersLosersInterval = setInterval(() => {
      fetchGainersData();
      fetchLosersData();
    }, 180000); // 3 minutes

    // Top movers bar: Update every 2 minutes (reduce from 90 seconds)
    const topMoversInterval = setInterval(fetchTopMoversData, 120000); // 2 minutes

    // Banners: Update every 5 minutes (increase from 3 minutes for stability)
    const topBannerInterval = setInterval(fetchTopBannerData, 300000);   // 5 minutes
    const bottomBannerInterval = setInterval(fetchBottomBannerData, 300000); // 5 minutes

    return () => {
      clearInterval(gainersLosersInterval);
      clearInterval(topMoversInterval);
      clearInterval(topBannerInterval);
      clearInterval(bottomBannerInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black relative">

      {/* Component Status Indicators */}
      <div className="fixed top-2 right-2 z-50 flex gap-1">
        {Object.entries(componentStatus).map(([component, status]) => (
          <div 
            key={component}
            className={`w-2 h-2 rounded-full ${
              status === 'connected' ? 'bg-green-400' : 'bg-red-400'
            }`}
            title={`${component}: ${status}`}
          />
        ))}
      </div>

      {/* 1h Change label above TopMoversBar, now inside the banner container */}
      <div className="w-full max-w-7xl mx-auto px-6" style={{ position: 'relative', height: 0 }}>
        <div className="absolute left-0 top-0 z-10 px-2 pt-2">
          <span className="px-4 py-1 text-xs font-bold tracking-wider uppercase text-pink-400 bg-black/40 rounded-xl border border-pink-400/10 shadow-none mb-2 block" style={{letterSpacing: '0.1em'}}>
            1h Change
          </span>
        </div>
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
        {/* Top Movers Section - Uses its own data and update interval */}
        <section className="mt-16 animate-fade-in-up" id="top-movers-bar-anchor">
          <div className="relative">
            <div className="absolute left-0 top-0 z-10 px-2 pt-2">
              <span className="px-4 py-1 text-xs font-bold tracking-wider uppercase text-pink-400 bg-black/40 rounded-xl border border-pink-400/10 shadow-none mb-2 block" style={{letterSpacing: '0.1em'}}>
                24h Top Movers
              </span>
            </div>
            <div className="pt-8">
              <TopMoversBar data={topMoversData} />
            </div>
          </div>
        </section>

        {/* Tables Grid - Each table has its own data source and update interval */}
        <section className="grid gap-8 lg:grid-cols-2 animate-fade-in-up">
          <CryptoTable 
            title="Top Gainers (3min)" 
            data={gainersData} 
            variant="gainers"
            componentStatus={componentStatus.gainers}
          />
          <CryptoTable 
            title="Top Losers (3min)" 
            data={losersData} 
            variant="losers"
            componentStatus={componentStatus.losers}
          />
        </section>

        {/* Top Scrolling Banner Section - Price focused */}
        <section className="animate-fade-in-up">
          <div className="mb-4">
            <span className="px-4 py-1 text-xs font-bold tracking-wider uppercase text-blue-400 bg-black/40 rounded-xl border border-blue-400/10">
              Price Movement Feed
            </span>
          </div>
          <ContinuousScrollingBanner data={topBannerData} bannerType="price" />
        </section>

        {/* Bottom Scrolling Banner Section - Volume focused */}
        <section className="animate-fade-in-up">
          <div className="mb-4">
            <span className="px-4 py-1 text-xs font-bold tracking-wider uppercase text-orange-400 bg-black/40 rounded-xl border border-orange-400/10">
              Volume Leaders Feed
            </span>
          </div>
          <ContinuousScrollingBanner data={bottomBannerData} bannerType="volume" />
        </section>

        <footer className="py-12 mt-20 text-center border-t border-gray-800/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium tracking-wider uppercase text-gray-400/90">
              Copyright 2025 GUISAN DESIGN - TOM PETRIE - BHABIT
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Individual Component Architecture v3.0 - Each UI element has its own data source
            </p>
          </div>
        </footer>
      </main>

      {/* DEBUG PANEL: Component-specific debugging */}
      <div className="max-w-7xl mx-auto my-4 p-4 bg-black/80 text-xs text-gray-300 rounded-xl border border-pink-400/20">
        <div className="mb-2 font-bold text-pink-400">INDIVIDUAL COMPONENT DEBUG PANEL:</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div><b>Component Status:</b> {JSON.stringify(componentStatus)}</div>
            <div><b>gainersData count:</b> {gainersData.length}</div>
            <div><b>losersData count:</b> {losersData.length}</div>
            <div><b>topMoversData count:</b> {topMoversData.length}</div>
          </div>
          <div>
            <div><b>topBannerData count:</b> {topBannerData.length}</div>
            <div><b>bottomBannerData count:</b> {bottomBannerData.length}</div>
            <div><b>isConnected:</b> {String(isConnected)}</div>
          </div>
        </div>
        <div className="mt-2 text-pink-300">Sample Data:</div>
        <div><b>gainersData[0]:</b> {gainersData.length > 0 ? JSON.stringify(gainersData[0]) : 'loading...'}</div>
        <div><b>topMoversData[0]:</b> {topMoversData.length > 0 ? JSON.stringify(topMoversData[0]) : 'loading...'}</div>
        <div><b>topBannerData[0]:</b> {topBannerData.length > 0 ? JSON.stringify(topBannerData[0]) : 'loading...'}</div>
      </div>
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
