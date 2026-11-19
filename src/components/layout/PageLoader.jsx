import Spinner from "../ui/Spinner.jsx";

export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-brand-500">
      <Spinner className="h-8 w-8" label="Loading page" />
    </div>
  );
}
