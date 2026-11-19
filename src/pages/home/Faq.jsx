import FaqList from "../../components/FaqList.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";

export default function Faq() {
  return (
    <section className="container-x section-y pt-0">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading tag="FAQ" title="Questions? We've Got" accent="Answers" description="Everything you need to know about ordering, delivery and partnering with FoodDash." />
          <Button to="/help" variant="outline" className="mt-8">Visit the help center</Button>
        </div>
        <FaqList />
      </div>
    </section>
  );
}
