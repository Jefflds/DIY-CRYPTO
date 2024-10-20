import { useTranslation } from 'react-i18next';
import { LanguageTexts } from '../../../domain/locales/Language';
import StatisticsImage from '../../assets/images/Statistics/Statistics.jpg';

type Info = {
  title: string;
  description: string;
};

export function Statistics() {
  const { t } = useTranslation();

  const infos = t(LanguageTexts.statistics.infos, {
    returnObjects: true,
  }) as Info[];

  return (
    <div id="statistics" className="relative flex flex-col shadow-sm pb-6">
      <div className="bg-primary-dark w-full py-12 px-6 sm:px-4 md:px-8 z-10 min-h-[80vh]">
        <section className="flex flex-col gap-y-10">
          <article className="w-full flex justify-center pt-12">
            <h3 className="max-w-2xl text-4xl text-center font-bold text-white whitespace-pre-wrap break-words">
              {t(LanguageTexts.statistics.title)}
            </h3>
          </article>
          <article className="flex flex-wrap justify-around gap-y-4 pb-32 md:pb-0">
            {infos.map((info, index) => (
              <div key={index}>
                <h4 className="text-center text-white text-sm font-bold">
                  {info.title}
                </h4>
                <p className="text-center text-white text-sm">
                  {info.description}
                </p>
              </div>
            ))}
          </article>
        </section>
      </div>

      <div className="w-full flex justify-center -mt-32 md:-mt-64 z-20">
        <img
          src={StatisticsImage}
          alt="Estatísticas"
          className="w-2/3 lg:w-1/3 object-cover relative z-20"
        />
      </div>
    </div>
  );
}
