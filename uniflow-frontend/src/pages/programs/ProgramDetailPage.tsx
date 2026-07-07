import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { applicationApi } from '@/api/endpoints/application.api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import { ArrowLeft, GraduationCap, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: program, isLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => applicationApi.getProgramById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton height="32px" width="200px" />
        <Skeleton height="200px" width="100%" />
        <Skeleton height="120px" width="100%" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Program not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        to="/programs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{program.name}</h1>
              <p className="text-white/70">{program.department}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Available Seats</p>
              <p className="text-lg font-bold text-text-primary">
                {program.availableSeats} <span className="text-sm font-normal text-text-secondary">/ {program.totalSeats}</span>
              </p>
            </div>
          </div>
          {program.availableSeats <= 5 && program.availableSeats > 0 && (
            <Badge variant="warning" className="mt-3">Limited availability</Badge>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Requirements</p>
              <p className="text-sm font-medium text-text-primary mt-0.5">
                {program.requirements || 'See department guidelines'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-3">About this Program</h2>
        <p className="text-text-secondary leading-relaxed">
          {program.description}
        </p>
      </Card>

      {/* Apply CTA */}
      <div className="sticky-bottom-bar sm:static sm:p-0 sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
        <Link to={`/application/new?programId=${program.id}`}>
          <Button
            fullWidth
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            disabled={program.availableSeats === 0}
          >
            {program.availableSeats === 0 ? 'No Seats Available' : t('programs.apply')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
