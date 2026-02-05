import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

/* Removed temporary embedded projects - component now relies on passed `data.projects` */

import { Project } from '../../../types/project';

type Props = {
  data: { projects: Project[] };
};

export default function ProjectsSection({ data }: Props) {
  const projects = data.projects;
  return (
    <section className="py-8">
      {/* WHY: Section heading for content organization */}
      {/* WHAT: "Selected Projects" title in bold */}
      {/* WHERE: Above the project grid for section identification */}
      <h2 className="text-3xl md:text-4xl font-bold mb-10">Selected Projects</h2>

      {/* WHY: Responsive grid for project display */}
      {/* WHAT: 1 column on mobile, 2 columns on desktop */}
      {/* REASON: Adapts to different screen sizes for optimal viewing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={`/downloads?project=${project.id}`}
            className="card group h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            {/* WHY: Project header with category and version */}
            {/* WHAT: Flex container with category and version badge */}
            {/* WHERE: Top of each project card */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-100">
              <div className="flex-1">
                <span className="text-xs md:text-sm font-bold text-[var(--primary)] uppercase tracking-wide">{project.category}</span>
                <h3 className="text-xl md:text-2xl font-bold mt-2">{project.name}</h3>
              </div>
              <span className="tag ml-4 flex-shrink-0">{project.version}</span>
            </div>

            {/* WHY: Project description for context */}
            {/* WHAT: Brief explanation of the project */}
            {/* REASON: Helps users understand project purpose quickly */}
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{project.description}</p>

            {/* WHY: Tags for technology stack visualization */}
            {/* WHAT: Small badges showing technologies used */}
            {/* WHERE: Below description, above action buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-50 transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            {/* WHY: Action links for user interaction */}
            {/* WHAT: GitHub link */}
            {/* REASON: Provides clear paths for further exploration */}

          </Link>
        ))}
      </div>
    </section>
  );
}