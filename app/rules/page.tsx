import { getAllBarrelRules, getAllMashbills } from "@/lib/decoder";
import RulesBrowser from "@/components/RulesBrowser";

export default function RulesPage() {
  const rules = getAllBarrelRules();
  const mashbills = getAllMashbills();

  return <RulesBrowser rules={rules} mashbills={mashbills} />;
}
