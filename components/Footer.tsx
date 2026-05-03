export default function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-stone-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} bgd</p>
        <p>Handmade bags, made one at a time.</p>
      </div>
    </footer>
  );
}
