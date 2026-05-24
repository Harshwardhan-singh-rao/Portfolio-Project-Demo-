export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 py-10 text-sm grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-2">About</h4>
          <p className="text-white/70">Smart college networking platform connecting students, mentors and opportunities.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-white/70">support@campusconnect.app</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Privacy</h4>
          <p className="text-white/70">We respect your privacy and protect your data.</p>
        </div>
        <div className="sm:col-span-2 md:col-span-1">
          <h4 className="font-semibold mb-2">©2025 Campus Connect</h4>
          <p className="text-white/70">All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
