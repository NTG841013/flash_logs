import Image from "next/image";

const integrations = [
  { name: "Next.js", logo: "/assets/frameworks/next-js.svg", status: "Official", invert: true },
  { name: "NestJS", logo: "/assets/frameworks/nest-js.png", status: "Official", invert: false },
  { name: "Express", logo: "/assets/frameworks/express-js.svg", status: "Official", invert: true },
  { name: "Django", logo: "/assets/frameworks/django.svg", status: "Official", invert: false },
  { name: "Flask", logo: "/assets/frameworks/Flask.svg", status: "Official", invert: false },
  { name: "Remix", logo: "/assets/frameworks/remix-js.png", status: "Beta", invert: false },
];

export function LandingIntegrations() {
  return (
    <section id="integrations" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Connect to your <span className="gradient-text">favorite tools.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl">
              Flash Logs integrates seamlessly with the modern web stack. 
              Our SDKs are designed to be non-blocking and lightweight.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                </div>
                <span className="text-foreground font-medium">Auto-detection of environments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                </div>
                <span className="text-foreground font-medium">Support for edge runtimes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                </div>
                <span className="text-foreground font-medium">Built-in PII redaction</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {integrations.map((item) => (
              <div 
                key={item.name}
                className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col items-center text-center group hover:border-primary/30 transition-all hover:bg-primary/5"
              >
                <div className={`h-12 w-12 mb-4 relative grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-300 ${item.invert ? 'brightness-0 invert' : 'brightness-[1.2]'}`}>
                  <Image 
                    src={item.logo} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-1.5"
                  />
                </div>
                <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${item.status === 'Official' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
