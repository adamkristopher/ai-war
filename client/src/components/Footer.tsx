import { FaXTwitter, FaGithub, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa6';

export function Footer() {
  return (
    <div className="bg-gray-800 border-t border-gray-700 py-6 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://x.com/rubberdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
            aria-label="X (Twitter)"
          >
            <FaXTwitter size={28} />
          </a>
          <a
            href="https://github.com/adamkristopher"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
            aria-label="GitHub"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/adam-carter-45b949356/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="https://www.instagram.com/firstmanio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
            aria-label="Instagram"
          >
            <FaInstagram size={28} />
          </a>
          <a
            href="https://www.youtube.com/@AuditechConsulting"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
            aria-label="Youtube"
          >
            <FaYoutube size={28} />
          </a>
        </div>

        {/* Copyright */}
        <div className="flex justify-center items-center gap-2">
          <div className="text-white text-lg">
            © 2025 ai war · Built by RubberDev
          </div>
          <div className="w-8 h-8">
            <img
              src="/assets/logo.png"
              alt="RubberDev logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
