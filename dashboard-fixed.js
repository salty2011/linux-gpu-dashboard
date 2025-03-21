// dashboard.js - Enhanced visual version
const { useState, useEffect } = React;

// Define LinuxGPUDashboard component
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
    return React.createElement("div", { className: "flex items-center justify-center h-screen" }, 
             "Loading Linux GPU data...");
  }
  
  if (error) {
    return React.createElement("div", { className: "text-red-500 p-4" }, error);
  }
  
  if (!data) {
    return React.createElement("div", { className: "p-4" }, "No data available");
  }
  
  const formatPercentage = (value) => `${value.toFixed(2)}%`;

  // Find AMD market share safely
  const amdShare = data.vendorMarketShare.find(function(v) { 
    return v.vendor === 'AMD'; 
  });
  const amdPercentage = amdShare ? amdShare.percentage.toFixed(2) : "N/A";
  
  // Get top GPU values safely
  const topGpuPercentage = data.top10GPUs[0] ? data.top10GPUs[0].percentage.toFixed(2) : "N/A";
  const secondGpuPercentage = data.top10GPUs[1] ? data.top10GPUs[1].percentage.toFixed(2) : "N/A";
  const combinedPercentage = data.top10GPUs[0] && data.top10GPUs[1] ? 
    (data.top10GPUs[0].percentage + data.top10GPUs[1].percentage).toFixed(2) : "N/A";
  
  // Get growing GPU values safely
  const topGrowingGpu = data.growingGPUs[0] || {};
  const topGrowingModel = topGrowingGpu.model || "N/A";
  const topGrowingChange = topGrowingGpu.change ? topGrowingGpu.change.toFixed(2) : "N/A";

  // Helper function to create visual bar
  const createBar = (percentage, color, maxWidth = 100) => {
    const width = Math.min(percentage, 100);
    const barStyle = {
      width: `${width}%`, 
      maxWidth: `${maxWidth}%`,
      backgroundColor: color,
      height: '20px',
      borderRadius: '4px',
      display: 'inline-block',
      marginRight: '8px',
      transition: 'width 0.5s ease'
    };
    
    return React.createElement("div", { style: barStyle });
  };

  // Use React.createElement instead of JSX
  return React.createElement("div", { className: "container mx-auto p-4 bg-gray-50 max-w-6xl" },
    React.createElement("div", { className: "text-center mb-6" },
      React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Linux GPU Usage Dashboard"),
      React.createElement("p", { className: "text-gray-600" }, "Based on Steam Hardware Survey data")
    ),
    
    React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
      // Vendor Market Share
      React.createElement("div", { className: "bg-white rounded-lg shadow p-4" },
        React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Vendor Market Share"),
        React.createElement("div", { className: "w-full" }, 
          data.vendorMarketShare.map(function(item, index) {
            return React.createElement("div", { 
              key: item.vendor,
              className: "mb-4" 
            },
              React.createElement("div", { className: "flex justify-between mb-1" },
                React.createElement("span", { 
                  className: "font-medium",
                  style: { color: VENDOR_COLORS[item.vendor] || SERIES_COLORS[index] }
                }, item.vendor),
                React.createElement("span", { className: "font-semibold" }, 
                  formatPercentage(item.percentage)
                )
              ),
              React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
                React.createElement("div", { 
                  className: "h-2.5 rounded-full",
                  style: { 
                    width: `${item.percentage}%`, 
                    backgroundColor: VENDOR_COLORS[item.vendor] || SERIES_COLORS[index]
                  } 
                })
              )
            );
          })
        )
      ),
      
      // GPU Series Breakdown
      React.createElement("div", { className: "bg-white rounded-lg shadow p-4" },
        React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "GPU Series Breakdown"),
        React.createElement("div", { className: "h-72 overflow-y-auto" },
          data.seriesBreakdown.slice(0, 10).map(function(item, index) {
            return React.createElement("div", { 
              key: item.series,
              className: "mb-3" 
            },
              React.createElement("div", { className: "flex justify-between mb-1" },
                React.createElement("span", { className: "font-medium" }, item.series),
                React.createElement("span", { className: "font-semibold" }, 
                  formatPercentage(item.percentage)
                )
              ),
              React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
                React.createElement("div", { 
                  className: "h-2.5 rounded-full",
                  style: { 
                    width: `${item.percentage}%`, 
                    backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length]
                  } 
                })
              )
            );
          })
        )
      ),
      
      // Top 10 GPUs
      React.createElement("div", { className: "bg-white rounded-lg shadow p-4" },
        React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Top 10 Linux GPUs"),
        React.createElement("div", { className: "h-72 overflow-y-auto" },
          data.top10GPUs.slice(0, 7).map(function(gpu, index) {
            const vendor = gpu.vendor || "Unknown";
            const color = VENDOR_COLORS[vendor] || '#888888';
            
            return React.createElement("div", { 
              key: gpu.model,
              className: "mb-3"
            },
              React.createElement("div", { className: "flex justify-between items-center mb-1" },
                React.createElement("div", { className: "flex items-center" },
                  React.createElement("div", { 
                    className: "w-3 h-3 rounded-full mr-2",
                    style: { backgroundColor: color }
                  }),
                  React.createElement("span", { className: "font-medium text-sm" }, gpu.model)
                ),
                React.createElement("span", { className: "font-semibold" }, 
                  formatPercentage(gpu.percentage)
                )
              ),
              React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
                React.createElement("div", { 
                  className: "h-2.5 rounded-full",
                  style: { 
                    width: `${gpu.percentage * 5}%`, // Scale for better visibility
                    backgroundColor: color
                  } 
                })
              )
            );
          })
        )
      ),
      
      // Fastest Growing GPUs
      React.createElement("div", { className: "bg-white rounded-lg shadow p-4" },
        React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Fastest Growing GPUs"),
        React.createElement("div", { className: "h-72 overflow-y-auto" },
          data.growingGPUs.map(function(gpu, index) {
            const vendor = gpu.vendor || "Unknown";
            const color = VENDOR_COLORS[vendor] || '#888888';
            
            return React.createElement("div", { 
              key: gpu.model,
              className: "mb-3"
            },
              React.createElement("div", { className: "flex justify-between items-center mb-1" },
                React.createElement("div", { className: "flex items-center" },
                  React.createElement("div", { 
                    className: "w-3 h-3 rounded-full mr-2",
                    style: { backgroundColor: color }
                  }),
                  React.createElement("span", { className: "font-medium text-sm" }, gpu.model)
                ),
                React.createElement("span", { className: "font-semibold text-green-600" }, 
                  "+" + gpu.change.toFixed(2) + "%"
                )
              ),
              React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
                React.createElement("div", { 
                  className: "h-2.5 rounded-full bg-green-500",
                  style: { 
                    width: `${gpu.change * 100}%`, // Scale for better visibility
                  } 
                })
              )
            );
          })
        )
      )
    ),
    
    // Key Insights
    React.createElement("div", { className: "mt-6 p-4 bg-white rounded-lg shadow" },
      React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Key Insights"),
      React.createElement("ul", { className: "list-disc pl-6 space-y-2" },
        React.createElement("li", {}, "AMD dominates the Linux gaming GPU market with ", 
          amdPercentage, "% market share."),
        React.createElement("li", {}, "The AMD Custom GPU 0405 (Steam Deck) is the most common GPU at ", 
          topGpuPercentage, "% of all Linux users."),
        React.createElement("li", {}, "The AMD Radeon Graphics (RADV VANGOGH) (Steam Deck OLED) is the second most common GPU at ", 
          secondGpuPercentage, "%."),
        React.createElement("li", {}, "The fastest growing GPU is ", 
          topGrowingModel, " with +", topGrowingChange, "% change."),
        React.createElement("li", {}, "Steam Deck (AMD Custom GPU 0405 + RADV VANGOGH) accounts for approximately ", 
          combinedPercentage, "% of all Linux gaming.")
      )
    ),
    
    // Footer
    React.createElement("footer", { className: "mt-8 text-center text-gray-500 text-sm" },
      React.createElement("p", {}, "© " + new Date().getFullYear() + " Linux GPU Dashboard • Data from Steam Hardware Survey")
    )
  );
};

// Render the component
ReactDOM.render(
  React.createElement(LinuxGPUDashboard, null),
  document.getElementById('root')
);