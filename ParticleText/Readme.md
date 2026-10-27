# ✨ Particle Text — 3D Interactive Particle Engine

A high-performance, real-time 3D particle system that morphs **10,000 particles** between an animated sphere and crisp text formations. Built with vanilla JavaScript and the HTML5 Canvas API — zero dependencies, single file, instant deploy.

---

## 🎬 Overview

Particle Text renders a dynamic, rotating 3D globe made of colorful particles. As you type into the input field, the particles smoothly transition from the sphere into the shape of your text — letter by letter, in real time. Move your cursor over the formed text to scatter the particles with a repulsion force, and double-click anywhere to return to the globe.

The entire engine runs at **60 FPS** using `Float32Array` typed arrays for all particle data, ensuring zero garbage collection pauses even with 10,000 active particles.

---

## 🚀 Features

| Feature | Description |
|---|---|
| **10,000 Particles** | Ultra-high density rendering for sharp, legible text formation |
| **True 3D Engine** | Full 3D coordinate system with perspective projection (FOV-based camera) |
| **Real-Time Typing** | Particles morph into text as you type — no submit button needed |
| **Fibonacci Sphere** | Default idle state uses golden-angle distribution for an organic, uniform globe |
| **Circular Motion** | Sphere particles rotate and float with orbital wobble for a living, breathing effect |
| **Cursor Repulsion** | Move your mouse over formed text to push particles away with physics-based force |
| **Multi-Line Wrapping** | Long phrases automatically wrap into multiple lines with adaptive font scaling |
| **Responsive Design** | Sphere and text scale dynamically based on screen dimensions |
| **Retina Support** | Full `devicePixelRatio` awareness for crisp rendering on HiDPI displays |
| **Zero Dependencies** | Single HTML file — no frameworks, no build tools, no npm |

---

## 📦 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required — works with `file://` protocol

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/particletext.git
   cd particletext
   ```

2. **Open directly in your browser**

   ```bash
   open index.html
   ```

   Or serve it locally for the best experience:

   ```bash
   npx serve ./
   ```

3. **Start typing** in the input field at the bottom of the screen.

---

## 🎮 Usage & Controls

### Keyboard

| Action | Effect |
|---|---|
| **Type in the input field** | Particles morph into the text in real time |
| **Clear the input field** | Particles return to the 3D sphere |

### Mouse

| Action | Effect |
|---|---|
| **Move cursor over text** | Repels nearby particles away from the cursor |
| **Move cursor away** | Particles snap back to their text positions |
| **Double-click anywhere** | Resets everything back to the rotating sphere |

### Tips

- Try typing **short words** (1–5 characters) for the sharpest particle formations
- Try typing **full sentences** to see multi-line wrapping in action
- Hover your cursor **slowly** over formed text for a satisfying scatter effect
- The sphere looks best if you let it spin for a few seconds after reset

---

## 🏗️ Technical Architecture

### Rendering Pipeline

```
Input Text → Off-screen Canvas → Pixel Sampling → Target Positions → Physics Simulation → Perspective Projection → Canvas Draw
```

### Core Systems

#### 1. Particle Data (Float32Array × 13)

All 10,000 particles store their state in typed arrays for maximum performance:

| Array | Purpose |
|---|---|
| `px`, `py`, `pz` | Current 3D position |
| `vx`, `vy`, `vz` | Current velocity |
| `tx`, `ty`, `tz` | Target position (sphere or text) |
| `ox`, `oy`, `oz` | Original sphere-home position |
| `hue`, `phase` | Per-particle color hue and wobble phase |

#### 2. Text Sampling Engine

Text is rendered to an **off-screen canvas** using the `900 weight Arial Black` font. The engine then scans every pixel of the rendered text, collecting coordinates where the alpha channel exceeds a threshold (`> 120`). These pixel positions become the particle targets.

- **Adaptive font sizing** — scales based on text length and viewport size
- **Multi-line wrapping** — splits at word boundaries with configurable `maxChars`
- **Sub-pixel jitter** — adds ±0.4px randomness to avoid grid-like patterns
- **Fisher-Yates shuffle** — randomizes target assignment so particles don't cluster

#### 3. Physics Engine

Each frame, every particle is attracted toward its target using a spring force:

```
velocity += (target - position) × springConstant
velocity *= friction
position += velocity
```

| Parameter | Sphere Mode | Text Mode |
|---|---|---|
| Spring constant | `0.02` | `0.022` |
| Friction | `0.82` | `0.82` |
| Rotation speed | `0.006 rad/frame` | `0` (static) |
| Orbital jitter | `1.8` | `0` |

#### 4. 3D Projection

The engine uses a simple perspective camera:

```
screenX = (worldX × FOV) / (worldZ + CAMERA_Z) + centerX
screenY = (worldY × FOV) / (worldZ + CAMERA_Z) + centerY
```

- **FOV**: `550` — field of view depth
- **CAMERA_Z**: `600` — camera distance from the origin

#### 5. Cursor Repulsion

When hovering over formed text, a radial force pushes particles away:

```
force = REPEL_FORCE × (1 - distance / REPEL_RADIUS) × 5
```

- **Radius**: `100px` — influence zone around the cursor
- **Force**: `8` — base repulsion strength

---

## ⚙️ Customization

You can tweak the engine by modifying constants at the top of the `<script>` block in `index.html`:

### Particle Count

```javascript
const N = 10000;  // Increase for denser text, decrease for better performance
```

> **Performance guide**: 5,000 particles run smoothly on most devices. 10,000 requires a decent GPU. 20,000+ is experimental.

### Sphere Size

```javascript
const R = baseDim > 1200 ? baseDim * 0.28 : baseDim * 0.42;
```

Adjust the multipliers to make the sphere larger or smaller relative to the viewport.

### Physics Feel

```javascript
// Spring constant — higher = snappier, lower = dreamier
const sp = appState === 0 ? 0.02 : 0.022;

// Friction — lower = more damping, higher = more bounce
vx[i] *= 0.82;
```

### Colors

```javascript
// Sphere mode: rainbow cycle
h = (hue[i] + t * 25) % 360;  // Speed of color cycling

// Text mode: neon cyan
h = 190; s = 90; l = 85;
```

### Rotation Speed

```javascript
if (appState === 0) rotY += 0.006;  // Radians per frame
```

---

## 📁 Project Structure

```
particletext/
├── index.html    # Complete application — HTML, CSS, and JS in one file
└── Readme.md     # This file
```

The entire application is self-contained in a single `index.html` file. No build step, no bundler, no external assets.

---

## 🌐 Browser Support

| Browser | Status |
|---|---|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 15+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Mobile Chrome | ⚠️ Works, may lag at 10K particles |
| Mobile Safari | ⚠️ Works, may lag at 10K particles |

> **Note**: For mobile devices, consider reducing the particle count to `5000` for smoother performance.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using vanilla JavaScript and the HTML5 Canvas API
</p>
