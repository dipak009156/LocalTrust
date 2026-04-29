export default function MobileLayout({ children }) {
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center sm:p-4 md:p-6">
      <div className="w-full min-h-screen sm:min-h-[800px] sm:h-[800px] sm:max-w-[390px] bg-white sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
}
