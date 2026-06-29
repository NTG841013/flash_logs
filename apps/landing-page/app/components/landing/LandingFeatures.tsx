import { 
  Zap, 
  Search, 
  Bell, 
  Shield, 
  Cpu, 
  BarChart3 
} from "lucide-react";

const features = [
  {
    name: "High-speed Ingestion",
    description: "Built on NATS and ClickHouse to handle millions of logs per minute without breaking a sweat.",
    icon: Zap,
    color: "text-blue-500",
  },
  {
    name: "Instant Search",
    description: "Query billions of logs and get results in sub-50ms. No more waiting for grep.",
    icon: Search,
    color: "text-purple-500",
  },
  {
    name: "Smart Alerts",
    description: "Configure complex alert rules and get notified via webhooks, Slack, or Discord instantly.",
    icon: Bell,
    color: "text-pink-500",
  },
  {
    name: "Secure by Design",
    description: "API keys are hashed with Argon2id. Your logs are encrypted and private by default.",
    icon: Shield,
    color: "text-emerald-500",
  },
  {
    name: "Zero Config SDKs",
    description: "Drop-in support for Next.js, Express, and NestJS. Get started in less than 60 seconds.",
    icon: Cpu,
    color: "text-orange-500",
  },
  {
    name: "Live Analytics",
    description: "Visualize ingestion trends, error rates, and system health with real-time dashboards.",
    icon: BarChart3,
    color: "text-cyan-500",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Everything you need for <br />
            <span className="gradient-text">modern monitoring.</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Flash Logs gives you the power of enterprise tools without the complexity. 
            Built for speed, scale, and developers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.name}
              className="p-8 rounded-3xl glass hover-lift transition-all duration-300 group"
            >
              <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:border-white/10 transition-colors shadow-xl ${feature.color}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {feature.name}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
