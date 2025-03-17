
import { useState } from 'react';
import { Movie } from '@/lib/data';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movie)}
    >
      <img 
        src={movie.thumbnailUrl} 
        alt={movie.title} 
        className="w-full h-full object-cover"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-netflix-card bg-opacity-90 p-3 flex flex-col justify-between animate-fade-in">
          <div>
            <h3 className="text-sm font-semibold mb-1">{movie.title}</h3>
            <div className="flex items-center mb-2">
              <span className="text-green-500 text-xs mr-2">{movie.rating}</span>
              <span className="text-xs mr-2">{movie.duration}</span>
              <span className="text-xs">{movie.year}</span>
            </div>
            <p className="text-xs line-clamp-3 text-netflix-gray-light">{movie.description}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="p-1 bg-white rounded-full">
                <Play className="h-3 w-3 text-black" />
              </button>
              <button className="p-1 bg-netflix-hover rounded-full border border-netflix-gray-dark">
                <Plus className="h-3 w-3" />
              </button>
              <button className="p-1 bg-netflix-hover rounded-full border border-netflix-gray-dark">
                <ThumbsUp className="h-3 w-3" />
              </button>
            </div>
            <button className="p-1 bg-netflix-hover rounded-full border border-netflix-gray-dark">
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
