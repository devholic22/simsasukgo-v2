const tabs = [
  { id: 'map', label: '지도 보기' },
  { id: 'markers', label: '마커 관리' },
  { id: 'settings', label: '설정' },
];

export function BottomNav() {
  return (
    <nav className='fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur'>
      <ul className='mx-auto grid max-w-md grid-cols-3 gap-2 p-3 text-center text-sm'>
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={
              index === 0
                ? 'rounded-xl bg-brand-600 py-2 text-white'
                : 'rounded-xl py-2 text-slate-600'
            }
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}
