
import { Movie } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Plus, ThumbsUp, X } from 'lucide-react';

interface MovieDetailProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetail = ({ movie, isOpen, onClose }: MovieDetailProps) => {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-netflix-card text-white p-0 max-w-3xl max-h-[90vh] overflow-auto">
        <div className="relative">
          <img 
            src={movie.imageUrl} 
            alt={movie.title} 
            className="w-full h-[40vh] object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-netflix-background rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-netflix-card to-transparent">
            <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
            <div className="flex space-x-4 mb-4">
              <button className="flex items-center bg-white text-black px-6 py-2 rounded font-semibold hover:bg-opacity-80 transition">
                <Play className="mr-2 h-5 w-5" /> Play
              </button>
              <button className="p-2 bg-netflix-hover rounded-full border border-white">
                <Plus className="h-6 w-6" />
              </button>
              <button className="p-2 bg-netflix-hover rounded-full border border-white">
                <ThumbsUp className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-green-500 font-medium mr-2">{movie.rating}</span>
            <span className="text-netflix-gray-light mr-2">{movie.duration}</span>
            <span className="text-netflix-gray-light mr-2">{movie.year}</span>
            <span className="px-1 py-0.5 text-xs border border-netflix-gray-dark rounded ml-2">HD</span>
          </div>
          
          <p className="mb-6">{movie.description}</p>
          
          <div className="mb-4">
            <span className="text-netflix-gray-dark mr-2">Genres:</span>
            <span>{movie.genre}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetail;
