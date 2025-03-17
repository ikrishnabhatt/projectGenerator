
import { Play, Info } from 'lucide-react';
import { Movie } from '@/lib/data';

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  return (
    <div className="relative h-[56.25vw]">
      <img
        src={movie.imageUrl}
        alt={movie.title}
        className="w-full h-full object-cover brightness-75"
      />
      
      <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-netflix-background to-transparent" />
      
      <div className="absolute bottom-[20%] left-0 content-container">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{movie.title}</h1>
        <p className="text-sm md:text-base lg:text-lg w-full md:w-1/2 lg:w-1/3 mb-6">
          {movie.description}
        </p>
        
        <div className="flex space-x-4">
          <button className="flex items-center justify-center bg-white text-black px-4 py-2 md:px-6 md:py-2 rounded font-semibold hover:bg-opacity-80 transition">
            <Play className="mr-2 h-5 w-5" />
            Play
          </button>
          <button className="flex items-center justify-center bg-gray-500 bg-opacity-70 text-white px-4 py-2 md:px-6 md:py-2 rounded font-semibold hover:bg-opacity-40 transition">
            <Info className="mr-2 h-5 w-5" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
