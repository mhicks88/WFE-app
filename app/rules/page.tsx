import { getAllBarrelRules } from "@/lib/decoder";
import RulesBrowser from "@/components/RulesBrowser";

export default function RulesPage() {
  const rules = getAllBarrelRules();

  return <RulesBrowser rules={rules} />;
}
