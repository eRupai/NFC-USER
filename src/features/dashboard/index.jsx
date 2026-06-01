import Topbar from "../../shared/components/Topbar";
import StatsBar from "./components/StatsBar";
import WriteNFCCard from "./components/WriteNFCCard";
import TapNFCCard from "./components/TapNFCCard";
import LiveAnalytics from "./components/LiveAnalytics";
import BottomSection from "./components/BottomSection";

export default function Dashboard({ onMenuClick }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} />
      <div className="flex-1 overflow-y-auto min-h-0">
        <StatsBar />
        <div className="px-3 sm:px-4 pb-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <WriteNFCCard />
              <TapNFCCard />
            </div>
            <div className="w-full xl:w-72 xl:flex-shrink-0">
              <LiveAnalytics />
            </div>
          </div>
        </div>
        <BottomSection />
      </div>
    </div>
  );
}
