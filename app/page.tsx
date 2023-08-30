import RawNumbersSection from "@/components/Dashboard/RawNumbersSection/RawNumbersSection";
import Stats from "@/components/Dashboard/Stats/Stats";
import StatsSection from "@/components/Dashboard/Stats/StatsSection";
import TotalStatus from "@/components/Dashboard/TotalStatus/TotalStatus";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between pt-24 overflow-y-auto overflow-x-hidden mb-4">
      <RawNumbersSection />
      <StatsSection />
      <TotalStatus />
    </main>
  );
}
