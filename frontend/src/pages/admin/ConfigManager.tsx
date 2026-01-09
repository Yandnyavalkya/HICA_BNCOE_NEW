import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

interface SiteConfig {
  _id?: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  show_recruitment?: boolean;
  recruitment_title?: string;
  recruitment_subtitle?: string;
  recruitment_form_url?: string;
  recruitment_deadline?: string;
  recruitment_message?: string;
  team_intro_video_url?: string;
}

export default function ConfigManager() {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const res = await api.get('/config');
      if (res.data && res.data.length > 0) {
        return res.data[0];
      }
      return null;
    },
  });

  const { register, handleSubmit, reset } = useForm<SiteConfig>();

  useEffect(() => {
    if (config) {
      // Format recruitment_deadline for datetime-local input if it exists
      let formattedDeadline = '';
      if (config.recruitment_deadline) {
        const dateObj = new Date(config.recruitment_deadline);
        if (!isNaN(dateObj.getTime())) {
          // Format: YYYY-MM-DDTHH:mm
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          formattedDeadline = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
      }
      
      reset({
        site_name: config.site_name || config.site_title || '',
        site_description: config.site_description || config.about_text || '',
        contact_email: config.contact_email || '',
        hero_title: config.hero_title || '',
        hero_subtitle: config.hero_subtitle || '',
        hero_image_url: config.hero_image_url || '',
        show_recruitment: config.show_recruitment || false,
        recruitment_title: config.recruitment_title || '',
        recruitment_subtitle: config.recruitment_subtitle || '',
        recruitment_form_url: config.recruitment_form_url || '',
        recruitment_deadline: formattedDeadline,
        recruitment_message: config.recruitment_message || '',
        team_intro_video_url: config.team_intro_video_url || '',
               social_links: {
                 facebook: config.social_links?.facebook || '',
                 twitter: config.social_links?.twitter || '',
                 instagram: config.social_links?.instagram || '',
                 linkedin: config.social_links?.linkedin || '',
                 github: config.social_links?.github || '',
                 youtube: config.social_links?.youtube || '',
               },
      });
    }
  }, [config, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: SiteConfig) => {
      if (config?._id) {
        const res = await api.put(`/config/${config._id}`, data);
        return res.data;
      } else {
        const res = await api.post('/config', data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      alert('✅ Configuration saved successfully!');
    },
    onError: () => {
      alert('❌ Failed to save configuration. Please try again.');
    },
  });

  const onSubmit = (data: SiteConfig) => {
    updateMutation.mutate(data);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #333',
    background: '#1c1e24',
    color: 'white',
    fontSize: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#ccc',
    fontWeight: '500' as const,
  };

  if (isLoading) {
    return (
      <AdminLayout title="Site Configuration">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Configuration">
      <div style={{
        background: '#2b0949',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
      }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '25px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#ff6b35' }}>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Site Name *</label>
                <input {...register('site_name', { required: true })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Site Description *</label>
                <textarea
                  {...register('site_description', { required: true })}
                  rows={4}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Contact Email *</label>
                <input {...register('contact_email', { required: true })} type="email" style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#993fea' }}>
              Hero Section
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Hero Title</label>
                <input {...register('hero_title')} style={inputStyle} placeholder="e.g., HICA's First Event" />
              </div>
              <div>
                <label style={labelStyle}>Hero Subtitle</label>
                <input {...register('hero_subtitle')} style={inputStyle} placeholder="e.g., Join us for an exciting event..." />
              </div>
              <div>
                <label style={labelStyle}>Hero Image URL</label>
                <input {...register('hero_image_url')} type="url" style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#ec4899' }}>
              Recruitment / Notice Section
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  {...register('show_recruitment')}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                  Show Recruitment Notice on Homepage (instead of event countdown)
                </label>
              </div>
              <div>
                <label style={labelStyle}>Recruitment Title</label>
                <input {...register('recruitment_title')} style={inputStyle} placeholder="e.g., HICA BNCOE | Recruitment – Season 2026" />
              </div>
              <div>
                <label style={labelStyle}>Recruitment Subtitle</label>
                <input {...register('recruitment_subtitle')} style={inputStyle} placeholder="e.g., We're recruiting students who are ready to commit..." />
              </div>
              <div>
                <label style={labelStyle}>Application Form URL</label>
                <input {...register('recruitment_form_url')} type="url" style={inputStyle} placeholder="https://forms.gle/..." />
              </div>
              <div>
                <label style={labelStyle}>Application Deadline (Date & Time)</label>
                <input {...register('recruitment_deadline')} type="datetime-local" style={inputStyle} />
                <small style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>
                  Format: YYYY-MM-DDTHH:MM (e.g., 2026-01-11T23:59)
                </small>
              </div>
              <div>
                <label style={labelStyle}>Recruitment Message</label>
                <textarea
                  {...register('recruitment_message')}
                  rows={6}
                  style={inputStyle}
                  placeholder="Enter the recruitment message/notice text here..."
                />
                <small style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>
                  This will be displayed in a formatted box. Use line breaks for paragraphs.
                </small>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#9333ea' }}>
              Team Introduction Video
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Team Introduction Video URL</label>
                <input {...register('team_intro_video_url')} type="url" style={inputStyle} placeholder="https://youtube.com/embed/... or direct video URL" />
                <small style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px', display: 'block' }}>
                  Enter a YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID) or a direct video URL. 
                  The video will be displayed on the Team page and will loop automatically.
                </small>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#00d4ff' }}>
              Social Media Links
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Facebook</label>
                <input {...register('social_links.facebook')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Twitter</label>
                <input {...register('social_links.twitter')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input {...register('social_links.instagram')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>LinkedIn</label>
                <input {...register('social_links.linkedin')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>GitHub</label>
                <input {...register('social_links.github')} type="url" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>YouTube</label>
                <input {...register('social_links.youtube')} type="url" style={inputStyle} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(45deg, #ff6b35, #ff4500)',
              borderRadius: '5px',
              color: 'white',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              opacity: updateMutation.isPending ? 0.6 : 1,
              marginTop: '10px',
            }}
          >
            {updateMutation.isPending ? '⏳ Saving...' : '💾 Save Configuration'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
