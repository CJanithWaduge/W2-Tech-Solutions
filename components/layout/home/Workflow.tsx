import { FileCode, Search, TestTube, Cloud, Shield } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileCode,
    title: 'Browse the Library',
    description: 'Explore all available projects and tools',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Search,
    title: 'Read the App Guide',
    description: 'Learn features, requirements, and how to use each tool',
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: '03',
    icon: TestTube,
    title: 'Download & Install',
    description: 'Get the latest version for your system',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function Workflow() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Getting Started</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Three simple steps to find and use what you need
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent)]/20 via-[var(--accent)]/50 to-[var(--accent)]/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] border-2 border-[var(--accent)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--accent)]">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Step card */}
                <div className="card text-center pt-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} mx-auto mb-6 flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-[var(--text-secondary)]">{step.description}</p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[var(--accent)] to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}