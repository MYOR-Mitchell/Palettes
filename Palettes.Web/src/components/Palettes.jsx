import styles from './Palettes.module.css';
import { useState, useEffect } from 'react';

const defaultPalette = {
  baseClr: '#1e1e1e',
  sectionClr: '#2a2a2a',
  textClr: '#ffffff',
  secondaryTextClr: '#b0b0b0',
  accentClr: '#4aa3df',
  lineClr: '#474747',
  hoverClr: '#333333',
  shadowClr: '#d0d0d0'
};

const apiBase = import.meta.env.VITE_API_BASE;

const Palette = () => {
  const [palette, setPalette] = useState(defaultPalette);
  const [paletteId, setPaletteId] = useState(null);
  const [loadId, setLoadId] = useState("");

  useEffect(() => {
    applyPalette();
  }, [palette]);

  const applyPalette = () => {
    Object.entries(palette)
      .filter(([key]) => key !== 'id')
      .forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        document.documentElement.style.setProperty(cssVar, value);
      });
  };

  const handleChange = (key, value) => {
    setPalette(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = () => {
    let cssText = Object.entries(palette)
      .map(([key, val]) => `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${val};`)
      .join('\n');

    navigator.clipboard.writeText(cssText);
    alert("Copied to clipboard");
  };

  const fetchRandomPalette = async () => {
    const res = await fetch(`${apiBase}/random`);
    const data = await res.json();
    setPaletteId(data.id);
    const { id, ...colorValues } = data;
    setPalette(colorValues);
  };

  const savePalette = async () => {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(palette)
    });
    if (res.ok) {
      const data = await res.json();
      setPaletteId(data.id);
      alert("Palette saved!");
    }
  };

  const deletePalette = async () => {
    if (!paletteId || !confirm("Are you sure you want to delete this palette?")) return;
    const res = await fetch(`${apiBase}/${paletteId}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Palette deleted.");
      setPaletteId(null);
      setPalette(defaultPalette);
    }
  };

  const loadPaletteById = async () => {
    if (!loadId.trim()) return;

    const res = await fetch(`${apiBase}/${loadId}`);
    if (res.ok) {
      const data = await res.json();
      setPaletteId(data.id);
      const { id, ...colorValues } = data;
      setPalette(colorValues);
    } else {
      alert("Palette not found.");
    }
  };

  const resetPalette = () => {
    setPalette(defaultPalette);
    setPaletteId(null);
  };

  return (
    <main className={styles.palettesWrapper}>
      <h1>Palette Generator</h1>
      <h2 style={{ fontWeight: 400, color: 'var(--secondary-text-clr)' }}>
        Generate color palettes for quick use or test your own.
      </h2>

      <div className={styles.colorContainer}>
        {Object.entries(palette)
          .filter(([key]) => key !== 'id')
          .map(([key, value]) => (
            <div className={styles.color} key={key}>
              <p>{key.replace(/Clr$/, '').replace(/([A-Z])/g, ' $1')}</p>
              <input
                type="color"
                value={value}
                onChange={e => handleChange(key, e.target.value)}
              />
              <input
                type="text"
                value={value}
                onChange={e => handleChange(key, e.target.value)}
              />
            </div>
          ))}
      </div>

      <div className={styles.buttons}>
        <ul>
          <li><button onClick={fetchRandomPalette}>Random</button></li>
          <li><button onClick={resetPalette}>Reset</button></li>
          <li><button onClick={copyToClipboard}>Copy</button></li>
          <li><button onClick={savePalette}>Save</button></li>
          <li><button onClick={deletePalette}>Delete</button></li>
        </ul>
        <div className={styles.loadSection}>
          <p style={{ minHeight: '1.5em' }}>{paletteId ? `Palette ID: ${paletteId}` : ''}</p>
          <input
            type="text"
            placeholder="Enter ID to load"
            value={loadId}
            onChange={e => setLoadId(e.target.value)}
          />
          <button className={styles.loadButton} onClick={loadPaletteById}>Load Palette</button>
        </div>
      </div>
    </main>
  );
};

export default Palette;