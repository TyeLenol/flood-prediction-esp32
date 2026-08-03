const fs = require('fs');
const file = 'components/landing/LandingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const tabContent = `          {/* Tab Content */}
          <div className="relative min-h-[500px]">
            {/* TAB 1: Global Telemetry */}
            <div className={\`absolute inset-0 transition-opacity duration-500 \${
              activeTab === 'telemetry' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }\`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Global Telemetry</h3>
                    <p className="text-slate-400 font-light max-w-md">Monitor live water levels, soil saturation, and rainfall across all deployed sensor nodes.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/overview.png" alt="Overview Dashboard" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Millimeter Precision</h4>
                    <p className="text-slate-300 font-light text-sm">Using JSN-SR04T ultrasonic sensors, water levels are measured with extreme accuracy and updated in real-time via the SIM7600 LTE module.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Multi-Factor Context</h4>
                    <p className="text-slate-300 font-light text-sm">It's not just water level. Capacitive soil moisture and digital rain sensors provide the full environmental picture before floods happen.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 2: Alerts */}
            <div className={\`absolute inset-0 transition-opacity duration-500 \${
              activeTab === 'alerts' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }\`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Real-time Alerts</h3>
                    <p className="text-slate-400 font-light max-w-md">Instant threshold breach detection and automated warning propagation.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/alerts.png" alt="Alerts Dashboard" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Dynamic Thresholds</h4>
                    <p className="text-slate-300 font-light text-sm">Configure custom Warning and Danger levels (in cm) dynamically without having to re-flash the ESP32 hardware.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Event Logging</h4>
                    <p className="text-slate-300 font-light text-sm">Every threshold breach is recorded immutably to Firebase, creating an auditable history of flood events for post-disaster analysis.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 3: Hardware Health */}
            <div className={\`absolute inset-0 transition-opacity duration-500 \${
              activeTab === 'health' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }\`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Hardware Health</h3>
                    <p className="text-slate-400 font-light max-w-md">Deep visibility into the status of the remote ESP32 nodes and component lifecycle.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/system.png" alt="System Info" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Connectivity Status</h4>
                    <p className="text-slate-300 font-light text-sm">Monitor GSM signal strength, battery levels, and the last-sync timestamp to ensure the node hasn't gone offline during a storm.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Component Diagnostics</h4>
                    <p className="text-slate-300 font-light text-sm">Individual status checks for the ESP32-WROOM-32, JSN-SR04T, and SIM7600 modules, alerting you to hardware failure before it's critical.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 4: Trends */}
            <div className={\`absolute inset-0 transition-opacity duration-500 \${
              activeTab === 'trends' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }\`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">Historical Trends</h3>
                    <p className="text-slate-400 font-light max-w-md">Analyze rainfall intensity vs. water level rise to improve predictive models.</p>
                  </div>
                  <div className="w-full mt-8 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center">
                    <img src="/analytics.png" alt="Analytics Dashboard" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Sensor Correlation</h4>
                    <p className="text-slate-300 font-light text-sm">Graphically compare cumulative rainfall (mm) against water level rise (cm) over time to visualize the saturation point of the local terrain.</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-2xl border border-slate-800 p-8 h-[calc(50%-12px)] flex flex-col justify-center">
                    <h4 className="text-teal-400 font-medium mb-2">Predictive Analysis</h4>
                    <p className="text-slate-300 font-light text-sm">By identifying how fast water rises per millimeter of rain, the system can project time-to-danger metrics before thresholds are actually hit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

const startIndex = content.indexOf('{/* Tab Content - Placeholder Images */}');
const endIndex = content.indexOf('{/* Credibility Footer */}');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + tabContent + '\n\n          ' + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log('Tabs updated!');
} else {
  console.log('Markers not found.');
}
