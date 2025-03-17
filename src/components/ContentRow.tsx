
import { Category, Movie } from '@/lib/data';
import MovieCard from './MovieCard';

interface ContentRowProps {
  category: Category;
  onSelectMovie: (movie: Movie) => void;
}

const ContentRow = ({ category, onSelectMovie }: ContentRowProps) => {
  return (
    <div className="content-row">
      <h2 className="row-header">{category.name}</h2>
      <div className="movie-slider">
        {category.movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentRow;
