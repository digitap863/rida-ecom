import Landing from "./components/home/Landing";
import ExploreProducts from "./components/home/ExploreProducts";
import ProvideBest from "./components/home/ProvideBest";
import Topdeal from "./components/home/Topdeal";
import Parts from "./components/home/Parts";
import TopSelling from "./components/home/TopSelling";

export default function Home() {
  return (
    <div className="">
      <Landing />
      <ExploreProducts />
      <ProvideBest />
      <Topdeal />
      <Parts/>
      <TopSelling />
    </div>
  );
}
