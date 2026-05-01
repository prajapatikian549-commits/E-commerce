export default function Avatar() {
  return (
    <div style={{ width: 200, height: 210, flexShrink: 0, filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.45))" }}>
      <svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", animation: "avatarFloat 3.6s ease-in-out infinite" }}>
        <circle cx="100" cy="100" r="96" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
        {/* Long hair behind */}
        <path d="M68 78 Q55 100 54 120 Q52 140 56 160 Q60 175 64 180 Q60 165 62 148 Q63 130 66 112 Q68 95 68 78Z" fill="#1a0a00"/>
        <path d="M132 78 Q145 100 146 120 Q148 140 144 160 Q140 175 136 180 Q140 165 138 148 Q137 130 134 112 Q132 95 132 78Z" fill="#1a0a00"/>
        <path d="M72 80 Q68 110 66 140 Q65 160 68 175 Q75 188 85 192 Q100 196 115 192 Q125 188 132 175 Q135 160 134 140 Q132 110 128 80 Q114 72 100 70 Q86 72 72 80Z" fill="#2c1206"/>
        {/* Lavender top */}
        <path d="M72 138 Q100 128 128 138 L132 172 Q100 180 68 172 Z" fill="#7c5cbf"/>
        <path d="M88 136 L100 148 L112 136 Q100 132 88 136Z" fill="#6a4daa"/>
        <path d="M72 138 Q60 145 54 158 Q58 162 64 160 Q68 152 74 145Z" fill="#7c5cbf"/>
        <path d="M128 138 Q140 145 146 158 Q142 162 136 160 Q132 152 126 145Z" fill="#7c5cbf"/>
        <path d="M88 140 Q100 136 112 140 Q106 138 100 137 Q94 138 88 140Z" fill="rgba(255,255,255,0.18)"/>
        {/* Neck */}
        <rect x="93" y="115" width="14" height="16" rx="6" fill="#f2b896"/>
        {/* Head */}
        <ellipse cx="100" cy="94" rx="30" ry="32" fill="#f2b896"/>
        {/* Hair top */}
        <ellipse cx="100" cy="67" rx="31" ry="17" fill="#2c1206"/>
        <path d="M70 74 Q67 85 68 98 Q69 108 70 115 Q67 108 66 96 Q64 82 67 70Z" fill="#2c1206"/>
        <path d="M130 74 Q133 85 132 98 Q131 108 130 115 Q133 108 134 96 Q136 82 133 70Z" fill="#2c1206"/>
        <path d="M70 72 Q78 58 92 62 Q84 66 80 74 Q75 68 70 72Z" fill="#3d1a08"/>
        <path d="M130 72 Q122 58 108 62 Q116 66 120 74 Q125 68 130 72Z" fill="#3d1a08"/>
        <path d="M85 61 Q92 55 100 56 Q108 55 115 61 Q108 58 100 58 Q92 58 85 61Z" fill="#1a0a00"/>
        <path d="M88 60 Q96 56 104 58" stroke="rgba(180,100,40,0.4)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Ears + earrings */}
        <ellipse cx="70" cy="94" rx="5" ry="6.5" fill="#eda882"/>
        <ellipse cx="130" cy="94" rx="5" ry="6.5" fill="#eda882"/>
        <circle cx="70" cy="100" r="2" fill="#f9d77e" stroke="#e6b84a" strokeWidth="0.5"/>
        <circle cx="130" cy="100" r="2" fill="#f9d77e" stroke="#e6b84a" strokeWidth="0.5"/>
        {/* Eyes */}
        <g style={{ animation: "eyeBlink 4.2s ease-in-out infinite", transformOrigin: "center" }}>
          <ellipse cx="86" cy="91" rx="8" ry="9" fill="white"/>
          <ellipse cx="86" cy="92" rx="6" ry="7" fill="#3b1f6e"/>
          <ellipse cx="86" cy="92" rx="4.5" ry="5.5" fill="#6b3fa0"/>
          <ellipse cx="86" cy="93" rx="3" ry="3.5" fill="#1a0a2e"/>
          <circle cx="88.5" cy="89.5" r="2" fill="white"/>
          <circle cx="84" cy="91" r="1" fill="rgba(255,255,255,0.7)"/>
          <path d="M78 87 Q82 83 86 82 Q90 83 94 87" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="79" y1="86" x2="77" y2="83" stroke="#1a0a00" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="86" y1="83" x2="86" y2="80" stroke="#1a0a00" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="93" y1="86" x2="95" y2="84" stroke="#1a0a00" strokeWidth="1.2" strokeLinecap="round"/>
          <ellipse cx="114" cy="91" rx="8" ry="9" fill="white"/>
          <ellipse cx="114" cy="92" rx="6" ry="7" fill="#3b1f6e"/>
          <ellipse cx="114" cy="92" rx="4.5" ry="5.5" fill="#6b3fa0"/>
          <ellipse cx="114" cy="93" rx="3" ry="3.5" fill="#1a0a2e"/>
          <circle cx="116.5" cy="89.5" r="2" fill="white"/>
          <circle cx="112" cy="91" r="1" fill="rgba(255,255,255,0.7)"/>
          <path d="M106 87 Q110 83 114 82 Q118 83 122 87" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <line x1="107" y1="86" x2="105" y2="83" stroke="#1a0a00" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="114" y1="83" x2="114" y2="80" stroke="#1a0a00" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="121" y1="86" x2="123" y2="84" stroke="#1a0a00" strokeWidth="1.2" strokeLinecap="round"/>
        </g>
        {/* Eyebrows */}
        <path d="M78 82 Q86 78 94 80" stroke="#2c1206" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M106 80 Q114 78 122 82" stroke="#2c1206" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Nose + lips */}
        <circle cx="100" cy="103" r="1.2" fill="#d4956a" opacity="0.6"/>
        <path d="M93 110 Q100 116 107 110" stroke="#c06878" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M95 109 Q100 112 105 109 Q100 114 95 109Z" fill="rgba(220,100,120,0.35)"/>
        {/* Blush */}
        <ellipse cx="76" cy="103" rx="8" ry="5" fill="rgba(255,140,140,0.3)"/>
        <ellipse cx="124" cy="103" rx="8" ry="5" fill="rgba(255,140,140,0.3)"/>
        {/* Round glasses */}
        <circle cx="86" cy="91" r="10" fill="none" stroke="rgba(180,140,255,0.75)" strokeWidth="1.6"/>
        <circle cx="114" cy="91" r="10" fill="none" stroke="rgba(180,140,255,0.75)" strokeWidth="1.6"/>
        <line x1="96" y1="91" x2="104" y2="91" stroke="rgba(180,140,255,0.75)" strokeWidth="1.6"/>
        <line x1="76" y1="89" x2="72" y2="87" stroke="rgba(180,140,255,0.75)" strokeWidth="1.4"/>
        <line x1="124" y1="89" x2="128" y2="87" stroke="rgba(180,140,255,0.75)" strokeWidth="1.4"/>
        {/* Arms + hands */}
        <path d="M72 145 Q60 153 54 162" stroke="#7c5cbf" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <path d="M128 145 Q140 153 146 162" stroke="#7c5cbf" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <ellipse cx="53" cy="164" rx="6.5" ry="5" fill="#f2b896"/>
        <ellipse cx="147" cy="164" rx="6.5" ry="5" fill="#f2b896"/>
        {/* Laptop */}
        <rect x="40" y="163" width="120" height="10" rx="3" fill="#1e293b"/>
        <rect x="42" y="163" width="116" height="8" rx="2" fill="#334155"/>
        <rect x="88" y="167" width="24" height="4" rx="2" fill="#475569"/>
        <rect x="48" y="127" width="104" height="40" rx="5" fill="#0f172a"/>
        <rect x="50" y="129" width="100" height="36" rx="4" fill="#1e293b" style={{ animation: "screenGlow 2.2s ease-in-out infinite" }}/>
        <rect x="97" y="127" width="6" height="3" rx="1.5" fill="#334155"/>
        <text x="56" y="140" fontFamily="monospace" fontSize="5" fill="#f472b6">@Author</text>
        <text x="86" y="140" fontFamily="monospace" fontSize="5" fill="#a78bfa">("Komal")</text>
        <text x="56" y="149" fontFamily="monospace" fontSize="5" fill="#34d399">@SpringBoot</text>
        <text x="56" y="158" fontFamily="monospace" fontSize="5" fill="#fb923c">build</text>
        <text x="74" y="158" fontFamily="monospace" fontSize="5" fill="#e2e8f0">(api)</text>
        <text x="100" y="158" fontFamily="monospace" fontSize="5" fill="#22d3ee" style={{ animation: "cursorBlink 0.85s step-end infinite" }}>▌</text>
        {/* Floating particles */}
        <text x="16" y="72" fontFamily="monospace" fontSize="8" fill="rgba(244,114,182,0.55)">&lt;/&gt;</text>
        <text x="162" y="80" fontFamily="monospace" fontSize="7" fill="rgba(167,139,250,0.55)">{"{}"}</text>
        <text x="14" y="112" fontFamily="monospace" fontSize="6" fill="rgba(52,211,153,0.5)">☕</text>
        <text x="166" y="112" fontFamily="monospace" fontSize="6" fill="rgba(251,191,36,0.5)">✨</text>
      </svg>
    </div>
  );
}
