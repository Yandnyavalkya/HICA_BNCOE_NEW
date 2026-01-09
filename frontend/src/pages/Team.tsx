import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { fallbackTeamMembers, fallbackConfig } from '../data/fallbackData';

type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  order?: number;
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
};

export default function Team() {
  const { data, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: async () => {
      try {
        const res = await api.get<TeamMember[]>('/team');
        return res.data;
      } catch (error) {
        console.warn('Using fallback team data');
        return fallbackTeamMembers as TeamMember[];
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: fallbackTeamMembers as TeamMember[],
  });

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

  const videoUrl = config?.team_intro_video_url;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Meet the Core Team
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            The passionate individuals driving HICA forward
          </p>
        </div>

        {/* Team Introduction Video */}
        {videoUrl && (
          <div className="mb-16 animate-fade-in-up">
            <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20 p-2">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                {(() => {
                  // Check if it's a YouTube URL
                  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                    let videoId = '';
                    
                    // Extract video ID from different YouTube URL formats
                    if (videoUrl.includes('youtube.com/embed/')) {
                      videoId = videoUrl.split('youtube.com/embed/')[1]?.split('?')[0] || '';
                    } else if (videoUrl.includes('youtube.com/watch?v=')) {
                      videoId = videoUrl.split('watch?v=')[1]?.split('&')[0] || '';
                    } else if (videoUrl.includes('youtu.be/')) {
                      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
                    }
                    
                    if (videoId) {
                      // YouTube embed URL with autoplay, loop, and mute
                      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=1&rel=0&modestbranding=1`;
                      return (
                        <iframe
                          src={embedUrl}
                          className="absolute top-0 left-0 w-full h-full rounded-xl"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          title="Team Introduction Video"
                        />
                      );
                    }
                  }
                  
                  // Direct video URL (MP4, WebM, etc.)
                  return (
                    <video
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="absolute top-0 left-0 w-full h-full object-contain rounded-xl"
                    >
                      Your browser does not support the video tag.
                    </video>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-white/70 mt-4">Loading team...</p>
          </div>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">No team members yet. Check back soon!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {data?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((member, index) => (
            <div
              key={member._id}
              className="group relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative z-10">
                {member.image_url ? (
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl mb-4 flex items-center justify-center">
                    <div className="text-6xl text-white/30">👤</div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-purple-400 font-semibold text-sm mb-1">{member.role}</p>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  {member.bio && (
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{member.bio}</p>
                  )}

                  <div className="flex justify-center space-x-3">
                    {member.social_links?.linkedin && (
                      <a
                        href={member.social_links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-blue-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                        title="LinkedIn"
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )}
                    {member.social_links?.github && (
                      <a
                        href={member.social_links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-gray-800 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                        title="GitHub"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                    {member.social_links?.twitter && (
                      <a
                        href={member.social_links.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-blue-400 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                        title="Twitter"
                      >
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {member.social_links?.instagram && (
                      <a
                        href={member.social_links.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-pink-600 text-white hover:text-white transition-all duration-300 transform hover:scale-110"
                        title="Instagram"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
