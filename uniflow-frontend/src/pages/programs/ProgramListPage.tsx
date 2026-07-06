import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { applicationApi } from '@/api/endpoints/application.api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { SkeletonCard } from '@/components/common/Skeleton';
import { Search, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ProgramListPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => applicationApi.getPrograms(),
  });

  const filteredPrograms = programs?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {t('programs.title')}
        </h1>
        <p className="text-text-secondary mt-1">
          {t('programs.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('programs.search')}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !filteredPrograms?.length ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-text-muted" />
          </div>
          <p className="text-text-secondary">{t('programs.noPrograms')}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrograms.map((program) => (
            <Card key={program.id} hover>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary leading-tight">
                        {program.name}
                      </h3>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {program.department}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary line-clamp-2">
                  {program.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border-light">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">
                      {program.availableSeats}/{program.totalSeats} seats
                    </span>
                    {program.availableSeats <= 5 && program.availableSeats > 0 && (
                      <Badge variant="warning">Few left</Badge>
                    )}
                    {program.availableSeats === 0 && (
                      <Badge variant="danger">Full</Badge>
                    )}
                  </div>
                  <Link to={`/programs/${program.id}`}>
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      {t('programs.details')}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
