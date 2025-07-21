import { Users, BookOpen, Calendar, Shield, ArrowRight } from 'lucide-react';

export default function FeatureCards() {
  const cards = [
    {
      icon: Shield,
      title: 'Administrators',
      description: 'Complete school management with advanced analytics.',
      features: ['User Management', 'Analytics Dashboard', 'Reports'],
    },
    {
      icon: BookOpen,
      title: 'Teachers',
      description: 'Upload notes, manage classes, project content.',
      features: ['Upload Materials', 'Class Management', 'Grading'],
    },
    {
      icon: Users,
      title: 'Students',
      description: 'Access learning materials, submit assignments.',
      features: ['Course Materials', 'Assignments', 'Grades'],
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-8">
          Choose Your Role
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-black/80 border border-yellow-500 rounded-lg p-6 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4 mx-auto">
                <card.icon className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{card.title}</h3>
              <p className="text-gray-400 text-center mb-4">{card.description}</p>
              <ul className="text-sm text-gray-300 mb-4 space-y-1">
                {card.features.map((f) => (
                  <li key={f}>✅ {f}</li>
                ))}
              </ul>
              <button
                onClick={() => alert(`Accessing ${card.title} Portal`)}
                className="w-full px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition flex justify-center items-center"
              >
                Access Portal <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
