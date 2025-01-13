import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlayCircle } from 'lucide-react';

export const VideoSection = ({ videoLink }) => {
  if (!videoLink) return null;

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoLink);
  if (!videoId) return null;

  return (
    <div className='mt-5'>
      <h2 className='text-3xl mb-3 font-urbanist font-semibold'>Video</h2>
      <Dialog>
        <DialogTrigger asChild>
          <div className='relative w-full h-[300px] bg-gray-100 rounded-lg cursor-pointer group overflow-hidden'>
            {/* Thumbnail */}
            <div 
              className='w-full h-full bg-cover bg-center'
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`
              }}
            >
              {/* Play button overlay */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300'>
                <PlayCircle className='w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform duration-300' />
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
          <DialogTitle className="hidden"/>
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}; 