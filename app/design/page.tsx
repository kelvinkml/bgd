export const metadata = { title: "Design Your Own — bgd" };

export default function DesignPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-semibold">Design your own</h1>
      <p className="text-stone-700">
        An interactive bag designer is in the works. You&apos;ll be able to pick a base shape,
        choose materials and hardware, and preview the result before commissioning the build.
      </p>
      <div className="border border-dashed border-stone-400 p-12 text-center text-stone-600 bg-stone-100">
        Designer coming soon
      </div>
      <p className="text-stone-700">
        In the meantime, get in touch and we can sketch something out together.
      </p>
    </div>
  );
}
