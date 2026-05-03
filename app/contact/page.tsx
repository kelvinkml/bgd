export const metadata = { title: "Contact — bgd" };

export default function ContactPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="text-stone-700">
        For commissions, questions, or just to say hi — drop me a line.
      </p>
      <a
        href="mailto:hello@example.com"
        className="inline-block px-4 py-2 bg-stone-900 text-stone-50 hover:bg-stone-700"
      >
        hello@example.com
      </a>
    </div>
  );
}
