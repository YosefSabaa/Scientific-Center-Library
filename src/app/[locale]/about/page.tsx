import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Target, Eye, Heart, Award, ShieldCheck, Sparkles } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import SectionTitle from '@/components/shared/SectionTitle';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  const values = [
    { icon: Award, title: t('valueQuality'), desc: t('valueQualityDesc'), color: 'from-purple-500 to-pink-500' },
    { icon: ShieldCheck, title: t('valueTrust'), desc: t('valueTrustDesc'), color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, title: t('valueService'), desc: t('valueServiceDesc'), color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t('title') }]} />

      <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-purple to-brand-light p-10 md:p-16 text-white">
        <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <Sparkles className="mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
          <p className="text-lg text-white/90">{t('subtitle')}</p>
        </div>
      </section>

      <section className="mb-16">
        <SectionTitle title={t('story')} align="start" />
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {t('storyText')}
        </p>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border-2 border-brand-purple/20 bg-gradient-to-br from-brand-purple/5 to-transparent p-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-light text-white shadow-lg">
            <Target className="h-7 w-7" />
          </div>
          <h2 className="mb-3 text-2xl font-bold">{t('mission')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('missionText')}</p>
        </div>

        <div className="rounded-3xl border-2 border-brand-light/20 bg-gradient-to-br from-brand-light/5 to-transparent p-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand-cyan text-white shadow-lg">
            <Eye className="h-7 w-7" />
          </div>
          <h2 className="mb-3 text-2xl font-bold">{t('vision')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('visionText')}</p>
        </div>
      </section>

      <section>
        <SectionTitle title={t('values')} />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${value.color} text-white shadow-lg transition-transform group-hover:rotate-6`}
              >
                <value.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{value.title}</h3>
              <p className="text-muted-foreground">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}