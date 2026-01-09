import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { fallbackConfig } from '../data/fallbackData';

export default function About() {
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      try {
        const res = await api.get('/config');
        return res.data && res.data.length > 0 ? res.data[0] : fallbackConfig;
      } catch (error) {
        console.warn('Using fallback config data');
        return fallbackConfig;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: fallbackConfig,
  });

  const siteName = config?.site_name || config?.site_title || 'HICA';
  const siteDescription = config?.site_description || config?.about_text || 
    'HICA is a community focused on hands-on learning, collaboration, and real-world impact. Through events, workshops, and mentorship, we help students and members grow technical, creative, and leadership skills.';

  // Split description into two paragraphs if it contains the full text
  const getDescriptionParagraphs = () => {
    if (!siteDescription) return [];
    
    // Check if description contains both sentences
    if (siteDescription.includes('HICA is a community') && siteDescription.includes('Through events, workshops')) {
      return [
        'HICA is a community focused on hands-on learning, collaboration, and real-world impact.',
        'Through events, workshops, and mentorship, we help students and members grow technical, creative, and leadership skills.'
      ];
    }
    
    // If it's the default "About HICA..." or similar, use the fallback
    if (siteDescription === 'About HICA...' || siteDescription.trim().length < 50) {
      return [
        'HICA is a community focused on hands-on learning, collaboration, and real-world impact.',
        'Through events, workshops, and mentorship, we help students and members grow technical, creative, and leadership skills.'
      ];
    }
    
    // Otherwise, return as single paragraph
    return [siteDescription];
  };

  const descriptionParagraphs = getDescriptionParagraphs();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {siteName}
          </h1>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">About Us</h2>
        </div>

        <div className="relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/10 hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 rounded-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            {descriptionParagraphs.length > 0 && (
              <div className="space-y-4">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg sm:text-xl text-white/90 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            
            {config?.contact_email && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/70 mb-2">Contact us at:</p>
                <a
                  href={`mailto:${config.contact_email}`}
                  className="text-purple-400 hover:text-purple-300 text-lg font-medium transition-colors duration-300 inline-flex items-center"
                >
                  <i className="far fa-envelope mr-2"></i>
                  {config.contact_email}
                </a>
              </div>
            )}

            <div className="pt-6 border-t border-white/10">
              <p className="text-white/70 mb-4 text-center">Follow us on social media</p>
              <div className="flex justify-center space-x-4">
                {config?.social_links?.instagram && (
                  <a
                    href={config.social_links.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-pink-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="Instagram"
                  >
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                )}
                {config?.social_links?.linkedin && (
                  <a
                    href={config.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-blue-700 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                )}
                {config?.social_links?.github && (
                  <a
                    href={config.social_links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-gray-800 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="GitHub"
                  >
                    <i className="fab fa-github text-xl"></i>
                  </a>
                )}
                {config?.social_links?.youtube && (
                  <a
                    href={config.social_links.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-red-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="YouTube"
                  >
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
                )}
                {config?.social_links?.facebook && (
                  <a
                    href={config.social_links.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-blue-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="Facebook"
                  >
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                )}
                {config?.social_links?.twitter && (
                  <a
                    href={config.social_links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 hover:bg-blue-400 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="Twitter"
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
