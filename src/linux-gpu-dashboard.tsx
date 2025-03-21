import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface VendorMarketShare {
  vendor: string;
  percentage: number;
}

interface GPUData {
  model: string;
  vendor: string;
  percentage: number;
  change: number;
}

interface SeriesData {
  series: string;
  percentage: number;
}

interface DashboardData {
  vendorMarketShare: VendorMarketShare[];
  top10GPUs: GPUData[];
  growingGPUs: GPUData[];
  seriesBreakdown: SeriesData[];
}

// Custom tooltip components
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  type?: 'vendor' | 'series' | 'gpu' | 'growth';
}> = ({ active, payload, label, type }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {type === 'vendor' && (
        <>
          <p className="font-semibold text-lg">{data.vendor}</p>
          <p className="text-gray-600 dark:text-gray-400">Market Share: {data.percentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {data.vendor === 'AMD' && 'Leading the Linux gaming market with strong Steam Deck adoption'}
            {data.vendor === 'NVIDIA' && 'Second-largest market share with strong RTX series presence'}
            {data.vendor === 'INTEL' && 'Growing presence with integrated graphics solutions'}
          </p>
        </>
      )}
      
      {type === 'series' && (
        <>
          <p className="font-semibold text-lg">{data.series}</p>
          <p className="text-gray-600 dark:text-gray-400">Market Share: {data.percentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {data.series.includes('RTX') && 'NVIDIA\'s latest generation graphics cards'}
            {data.series.includes('Radeon RX') && 'AMD\'s gaming-focused graphics cards'}
            {data.series.includes('UHD') && 'Intel\'s integrated graphics solutions'}
          </p>
        </>
      )}
      
      {type === 'gpu' && (
        <>
          <p className="font-semibold text-lg">{data.model}</p>
          <p className="text-gray-600 dark:text-gray-400">Market Share: {data.percentage.toFixed(2)}%</p>
          <p className="text-gray-600 dark:text-gray-400">Monthly Change: {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {data.model.includes('Custom GPU 0405') && 'Steam Deck (Original)'}
            {data.model.includes('RADV VANGOGH') && 'Steam Deck OLED'}
            {data.model.includes('Raphael') && 'AMD Ryzen 7000 Series Integrated Graphics'}
          </p>
        </>
      )}
      
      {type === 'growth' && (
        <>
          <p className="font-semibold text-lg">{data.model}</p>
          <p className="text-gray-600 dark:text-gray-400">Monthly Growth: +{data.change.toFixed(2)}%</p>
          <p className="text-gray-600 dark:text-gray-400">Current Share: {data.percentage.toFixed(2)}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {data.model.includes('Custom GPU 0405') && 'Steam Deck (Original) - Leading growth in Linux gaming'}
            {data.model.includes('RADV VANGOGH') && 'Steam Deck OLED - Strong adoption of the new model'}
            {data.model.includes('Raphael') && 'AMD Ryzen 7000 Series - Growing integrated graphics adoption'}
          </p>
        </>
      )}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        ))}
      </div>
    </div>
  </div>
);

const LinuxGPUDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Color schemes
  const VENDOR_COLORS: Record<string, string> = {
    'AMD': '#ED1C24',
    'NVIDIA': '#76B900',
    'INTEL': '#0071C5',
    'Unknown': '#888888'
  };
  
  const SERIES_COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c',
    '#d0ed57', '#ffc658', '#ff8042', '#ff6361', '#bc5090',
    '#58508d', '#003f5c'
  ];

  // Memoized chart colors based on dark mode
  const chartColors = useMemo(() => ({
    background: darkMode ? '#1F2937' : '#FFFFFF',
    text: darkMode ? '#F3F4F6' : '#111827',
    grid: darkMode ? '#374151' : '#E5E7EB',
  }), [darkMode]);

  useEffect(() => {
    // Use hardcoded data based on our previous analysis
    const dashboardData: DashboardData = {
      vendorMarketShare: [
        {vendor: 'AMD', percentage: 69.29},
        {vendor: 'NVIDIA', percentage: 21.14},
        {vendor: 'INTEL', percentage: 9.57}
      ],
      top10GPUs: [
        {model: 'AMD AMD Custom GPU 0405', vendor: 'AMD', percentage: 20.98, change: 1},
        {model: 'AMD Radeon Graphics (RADV VANGOGH)', vendor: 'AMD', percentage: 13.81, change: 0.74},
        {model: 'Other', vendor: 'Unknown', percentage: 7.26, change: 0.04},
        {model: 'AMD Raphael', vendor: 'AMD', percentage: 3.63, change: 0.29},
        {model: 'AMD Radeon Vega Series / Radeon Vega Mobile Series', vendor: 'AMD', percentage: 2.85, change: 0.1},
        {model: 'AMD Radeon RX 6750 XT', vendor: 'AMD', percentage: 2.09, change: 0.04},
        {model: 'AMD Radeon 780M Graphics', vendor: 'AMD', percentage: 1.99, change: 0.05},
        {model: 'AMD Radeon RX 480', vendor: 'AMD', percentage: 1.75, change: 0.04},
        {model: 'AMD Radeon RX 6600 XT', vendor: 'AMD', percentage: 1.74, change: 0.05},
        {model: 'AMD Radeon RX 7900 XTX', vendor: 'AMD', percentage: 1.68, change: 0.27}
      ],
      growingGPUs: [
        {model: 'AMD AMD Custom GPU 0405', vendor: 'AMD', percentage: 20.98, change: 1},
        {model: 'AMD Radeon Graphics (RADV VANGOGH)', vendor: 'AMD', percentage: 13.81, change: 0.74},
        {model: 'AMD Raphael', vendor: 'AMD', percentage: 3.63, change: 0.29},
        {model: 'AMD Radeon RX 7900 XTX', vendor: 'AMD', percentage: 1.68, change: 0.27},
        {model: 'Intel UHD Graphics 620', vendor: 'INTEL', percentage: 1.39, change: 0.23}
      ],
      seriesBreakdown: [
        {series: 'Other', percentage: 55.96},
        {series: 'NVIDIA RTX 3000', percentage: 6.52},
        {series: 'AMD Radeon RX 6000', percentage: 5.67},
        {series: 'NVIDIA GTX 1000', percentage: 5.25},
        {series: 'NVIDIA RTX 4000', percentage: 3.61},
        {series: 'AMD Radeon RX 7000', percentage: 3.58},
        {series: 'Intel UHD', percentage: 3.50},
        {series: 'Intel HD', percentage: 3.35},
        {series: 'NVIDIA RTX 2000', percentage: 2.58},
        {series: 'AMD Radeon RX 4000', percentage: 1.75},
        {series: 'AMD Radeon RX 5000', percentage: 1.71},
        {series: 'Intel Iris', percentage: 1.59}
      ]
    };
    
    setData(dashboardData);
    setLoading(false);
  }, []);
  
  const formatPercentage = (value: number): string => `${value.toFixed(2)}%`;

  if (loading) {
    return <LoadingSkeleton />;
  }
  
  if (!data) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Linux GPU Usage Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Based on Steam Hardware Survey data</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Market Share */}
        <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Vendor Market Share</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.vendorMarketShare}
                dataKey="percentage"
                nameKey="vendor"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ vendor, percentage }: { vendor: string; percentage: number }) => `${vendor}: ${percentage.toFixed(1)}%`}
              >
                {data.vendorMarketShare.map((entry: VendorMarketShare, index: number) => (
                  <Cell key={`cell-${index}`} fill={VENDOR_COLORS[entry.vendor] || SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip type="vendor" />}
                contentStyle={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: chartColors.text,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* GPU Series Breakdown */}
        <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">GPU Series Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.seriesBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="series" 
                tick={{fontSize: 10, fill: chartColors.text}} 
                interval={0} 
                angle={-45} 
                textAnchor="end" 
                height={80} 
              />
              <YAxis 
                tickFormatter={formatPercentage}
                tick={{fill: chartColors.text}}
              />
              <Tooltip 
                content={<CustomTooltip type="series" />}
                contentStyle={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
              <Bar dataKey="percentage" name="Market Share">
                {data.seriesBreakdown.map((entry: SeriesData, index: number) => (
                  <Cell key={`cell-${index}`} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top 10 GPUs */}
        <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Top 10 Linux GPUs</h2>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart 
              data={data.top10GPUs}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                type="number" 
                tickFormatter={formatPercentage}
                tick={{fill: chartColors.text}}
              />
              <YAxis 
                type="category" 
                dataKey="model" 
                width={150}
                tick={{ fontSize: 10, fill: chartColors.text }} 
              />
              <Tooltip 
                content={<CustomTooltip type="gpu" />}
                contentStyle={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
              <Bar dataKey="percentage" name="Market Share">
                {data.top10GPUs.map((entry: GPUData, index: number) => (
                  <Cell key={`cell-${index}`} fill={VENDOR_COLORS[entry.vendor] || '#888888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Fastest Growing GPUs */}
        <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Fastest Growing GPUs</h2>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart 
              data={data.growingGPUs}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                type="number" 
                tickFormatter={(value: number) => `+${value.toFixed(2)}%`}
                tick={{fill: chartColors.text}}
              />
              <YAxis 
                type="category" 
                dataKey="model" 
                width={150}
                tick={{ fontSize: 10, fill: chartColors.text }} 
              />
              <Tooltip 
                content={<CustomTooltip type="growth" />}
                contentStyle={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
              <Bar dataKey="change" name="Monthly Change">
                {data.growingGPUs.map((entry: GPUData, index: number) => (
                  <Cell key={`cell-${index}`} fill={VENDOR_COLORS[entry.vendor] || '#888888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>AMD dominates the Linux gaming GPU market with {data.vendorMarketShare.find((v: VendorMarketShare) => v.vendor === 'AMD')?.percentage.toFixed(2)}% market share.</li>
          <li>The AMD Custom GPU 0405 (Steam Deck) is the most common GPU at {data.top10GPUs[0]?.percentage.toFixed(2)}% of all Linux users.</li>
          <li>The AMD Radeon Graphics (RADV VANGOGH) (Steam Deck OLED) is the second most common GPU at {data.top10GPUs[1]?.percentage.toFixed(2)}%.</li>
          <li>The fastest growing GPU is {data.growingGPUs[0]?.model} with +{data.growingGPUs[0]?.change.toFixed(2)}% change.</li>
          <li>Steam Deck (AMD Custom GPU 0405 + RADV VANGOGH) accounts for approximately {(data.top10GPUs[0]?.percentage + data.top10GPUs[1]?.percentage).toFixed(2)}% of all Linux gaming.</li>
        </ul>
      </div>
    </div>
  );
};

export default LinuxGPUDashboard;
