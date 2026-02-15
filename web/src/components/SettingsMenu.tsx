import { useEffect, useRef, useState } from "react";
import OptionsPanel from "./OptionsPanel";
import AboutPanel from "./AboutPanel";

type Panel = "options" | "about" | null;

export default function SettingsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const openPanel = (panel: Panel) => {
    setActivePanel(panel);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="settings-wrapper" ref={menuRef}>
        <button
          className="settings-cog"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Settings"
          data-testid="settings-cog"
        >
          ⚙
        </button>

        {menuOpen && (
          <div className="settings-menu" data-testid="settings-menu">
            <button className="settings-menu__item" onClick={() => openPanel("options")}>
              Options
            </button>
            <button className="settings-menu__item" onClick={() => openPanel("about")}>
              About
            </button>
          </div>
        )}
      </div>

      {activePanel === "options" && (
        <OptionsPanel onClose={() => setActivePanel(null)} />
      )}
      {activePanel === "about" && (
        <AboutPanel onClose={() => setActivePanel(null)} />
      )}
    </>
  );
}
