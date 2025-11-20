import { getAllBottles } from "@/lib/bottles";
import BottleSearch from "@/components/BottleSearch";

export default function Home() {
  const bottles = getAllBottles();

  return <BottleSearch bottles={bottles} />;
}
