import type { FC } from 'react';

type Tab = {
  key: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (label: string) => void;
};

const Tabs: FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-2">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-purple-700">
                {tab.label}
              </span>
            </div>
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/85 to-purple-700"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;