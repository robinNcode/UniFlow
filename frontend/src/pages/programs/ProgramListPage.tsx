import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { applicationApi } from '@/api/endpoints/application.api';
import { SkeletonCard } from '@/components/common/Skeleton';
import { Search, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Badge from '@/components/common/Badge';

export default function ProgramListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => applicationApi.getPrograms(),
  });

  const filtered = programs?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Programs</h1>
          <p className="text-sm text-text-secondary mt-1">
            Browse available programs and apply for admission
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search programs or departments…"
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : !filtered?.length ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center">
          <GraduationCap className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No programs match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              {/* Card top color bar */}
              <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-primary to-primary-hover" />

              <div className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm leading-snug">
                      {program.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">{program.department}</p>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 flex-1">
                  {program.description ?? 'Program details available on application.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border-light">
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Users className="h-3.5 w-3.5 text-text-muted" />
                    <span>
                      <strong className="text-text-primary">{program.availableSeats}</strong>
                      /{program.totalSeats} seats
                    </span>
                    {program.availableSeats === 0 && (
                      <Badge variant="danger">Full</Badge>
                    )}
                    {program.availableSeats > 0 && program.availableSeats <= 5 && (
                      <Badge variant="warning">Few left</Badge>
                    )}
                  </div>
                  <Link
                    to={`/programs/${program.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View details
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
