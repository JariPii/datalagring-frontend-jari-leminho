import Hero from '@/components/hero/Hero';

export default function Home() {
  return (
    <main className='flex flex-col w-full grow mt-[10dvh]'>
      <Hero />
      <div className='h-14 flex items-center justify-center bg-violet-900'>
        Content container
      </div>
    </main>
  );
}
