import type { FilterType, SortType } from '../types';
import './TodoFilters.css';

interface TodoFiltersProps {
  currentFilter: FilterType;
  currentSort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
}

export default function TodoFilters({
                                      currentFilter,
                                      currentSort,
                                      onFilterChange,
                                      onSortChange }: TodoFiltersProps) {

  return (
    <div className="filters-container">

      <div className="filter-group">
        <span className="filter-label">Afficher :</span>
        <button
          className={currentFilter === 'all' ? 'active' : ''}
          onClick={() => onFilterChange('all')}
          aria-pressed={currentFilter === 'all'}
        >
          Tout
        </button>
        <button
          className={currentFilter === 'undone' ? 'active' : ''}
          onClick={() => onFilterChange('undone')}
          aria-pressed={currentFilter === 'undone'}
        >
          À faire
        </button>
        <button
          className={currentFilter === 'done' ? 'active' : ''}
          onClick={() => onFilterChange('done')}
          aria-pressed={currentFilter === 'done'}
        >
          Terminé
        </button>
      </div>

      <div className="filter-group">
        <span className="filter-label">Trier par :</span>
        <button
          className={currentSort === 'date' ? 'active' : ''}
          onClick={() => onSortChange('date')}
          aria-pressed={currentSort === 'date'}
        >
          Date
        </button>
        <button
          className={currentSort === 'alphabetical' ? 'active' : ''}
          onClick={() => onSortChange('alphabetical')}
          aria-pressed={currentSort === 'alphabetical'}
        >
          Nom
        </button>
      </div>

    </div>
  );
}