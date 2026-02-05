import { Calendar, Code2, Mic } from 'lucide-react';

/* WHY: Recent updates data for sidebar */
/* WHAT: Array of update objects with dates and descriptions */
/* REASON: Shows recent activity and keeps content fresh */
const updates = [
  {
    date: "Just Updated",
    title: "Released v2.0 of Fluid Design Framework",
    description: "New container queries and intrinsic layout helpers added.",
    icon: <Code2 size={20} />,
    color: "bg-blue-100 text-blue-800"
  },
  {
    date: "Last Month",
    title: "Speaking at WebConf: The Future of CSS",
    description: "Discussing layouts that don't rely on breakpoints.",
    icon: <Mic size={20} />,
    color: "bg-purple-100 text-purple-800"
  },
  {
    date: "Last Quarter",
    title: "Open Sourced 'Intrinsic Grid' Plugin",
    description: "A lightweight utility for generating responsive grids.",
    icon: <Code2 size={20} />,
    color: "bg-green-100 text-green-800"
  }
];

/* WHY: Technology stack for skills display */
/* WHAT: Array of technology names */
/* WHERE: Used in tech stack section of sidebar */
const techStack = ["React", "Next.js", "TypeScript", "Tailwind", "PostgreSQL", "Framer Motion", "Node.js"];

export default function Sidebar() {
  return (
    <div className="space-y-8">
      {/* WHY: Recent updates section for latest news */}
      {/* WHAT: Card containing chronological updates */}
      {/* REASON: Keeps visitors informed about recent activities */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-8">What's New</h3>
        <div className="space-y-8">
          {updates.map((update, index) => (
            <div key={index} className="border-l-4 border-[var(--primary)] pl-5 pb-5 last:pb-0">
              {/* WHY: Date display with calendar icon */}
              {/* WHAT: Update date with icon for visual recognition */}
              {/* WHERE: Top of each update item */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-[var(--primary)]" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{update.date}</span>
              </div>
              <h4 className="font-bold mb-2 text-gray-800 leading-snug">{update.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{update.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY: Tech stack visualization section */}
      {/* WHAT: Card showing technologies used */}
      {/* REASON: Demonstrates technical expertise and skills */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-8">Tech Stack</h3>
        <div className="flex flex-wrap gap-3 mb-8">
          {techStack.map((tech, index) => (
            <span 
              key={index}
              className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg font-semibold text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed italic border-t pt-6">
          Tools and frameworks I use to bring ideas to life with a focus on maintainability and performance.
        </p>
      </div>

      {/* WHY: Skills categorization section */}
      {/* WHAT: Gradient background card with skill areas */}
      {/* REASON: Visually appealing display of expertise areas */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-shadow">
        <h4 className="font-bold text-xl mb-8 text-gray-800">Mastered Technologies</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          {["FRONTEND", "DEVOPS", "BACKEND", "UI/UX", "SECURITY", "CLOUD"].map((area, index) => (
            <div key={index} className="p-4 bg-white/70 hover:bg-white rounded-lg font-semibold text-xs text-gray-700 transition-colors cursor-default">
              {area}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}