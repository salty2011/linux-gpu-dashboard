// dashboard.js - Ready for GitHub Pages
// Use the global variables from the CDN imports
const { useState, useEffect } = React;
const { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } = Recharts;

const LinuxGPUDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Color schemes
  const VENDOR_COLORS = {
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

  useEffect(() => {
    // Use hardcoded data based on our previous analysis
    const dashboardData = {
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
    
    // Set the data directly
    setData(dashboardData);
    setLoading(false);
  }, []);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading Linux GPU data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  
  if (!data) {
    return <div className="p-4">No data available</div>;
  }
  
  const formatPercentage = (value) => `${value.toFixed(2)}%`;

  return (
    <div className="container mx-auto p-4 bg-gray-50 max-w-6xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Linux GPU Usage Dashboard</h1>
        <p className="text-gray-600">Based on Steam Hardware Survey data</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Market Share */}
        <div className="bg-white rounded-lg shadow p-4">
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
                label={({ vendor, percentage }) => `${vendor}: ${percentage.toFixed(1)}%`}
              >
                {data.vendorMarketShare.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={VENDOR_COLORS[entry.vendor] || SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatPercentage} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* GPU Series Breakdown */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">GPU Series Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.seriesBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="series" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={formatPercentage} />
              <Tooltip formatter={formatPercentage} />
              <Bar dataKey="percentage" name="Market Share">
                {data.seriesBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top 10 GPUs */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Top 10 Linux GPUs</h2>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart 
              data={data.top10GPUs}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatPercentage} />
              <YAxis 
                type="category" 
                dataKey="model" 
                width={150}
                tick={{ fontSize: 10 }} 
              />
              <Tooltip formatter={formatPercentage} />
              <Bar dataKey="percentage" name="Market Share">
                {data.top10GPUs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={VENDOR_COLORS[entry.vendor] || '#888888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Fastest Growing GPUs */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Fastest Growing GPUs</h2>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart 
              data={data.growingGPUs}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `+${value.toFixed(2)}%`} />
              <YAxis 
                type="category" 
                dataKey="model" 
                width={150}
                tick={{ fontSize: 10 }} 
              />
              <Tooltip formatter={(value) => `+${value.toFixed(2)}%`} labelFormatter={(label) => `Growth`} />
              <Bar dataKey="change" name="Monthly Change">
                {data.growingGPUs.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={VENDOR_COLORS[entry.vendor] || '#888888'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>AMD dominates the Linux gaming GPU market with {data.vendorMarketShare.find(v => v.vendor === 'AMD')?.percentage.toFixed(2)}% market share.</li>
          <li>The AMD Custom GPU 0405 (Steam Deck) is the most common GPU at {data.top10GPUs[0]?.percentage.toFixed(2)}% of all Linux users.</li>
          <li>The AMD Radeon Graphics (RADV VANGOGH) (Steam Deck OLED) is the second most common GPU at {data.top10GPUs[1]?.percentage.toFixed(2)}%.</li>
          <li>The fastest growing GPU is {data.growingGPUs[0]?.model} with +{data.growingGPUs[0]?.change.toFixed(2)}% change.</li>
          <li>Steam Deck (AMD Custom GPU 0405 + RADV VANGOGH) accounts for approximately {(data.top10GPUs[0]?.percentage + data.top10GPUs[1]?.percentage).toFixed(2)}% of all Linux gaming.</li>
        </ul>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Linux GPU Dashboard • Data from Steam Hardware Survey</p>
      </footer>
    </div>
  );
};

// Render the component
ReactDOM.render(<LinuxGPUDashboard />, document.getElementById('root'));
