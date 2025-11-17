# Custom Video Player Component

A fully custom, accessible, and responsive React video player component built with modern web standards.

## Features

✅ **Quality Selector** - Switch between video qualities without losing position  
✅ **Theater Mode** - Expandable cinema-style view  
✅ **Playback Speed Control** - Multiple speed options (0.5x - 2x)  
✅ **Download Protection** - Prevents direct video downloads  
✅ **Keyboard Shortcuts** - Full keyboard navigation support  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Accessibility** - Screen reader support and ARIA labels  
✅ **Modern Styling** - Clean CSS with smooth animations  

## Quick Start

```jsx
import VideoPlayer from './VideoPlayer';

const sources = [
  {
    quality: '1080p',
    src: '/video-1080p.mp4',
    type: 'video/mp4'
  },
  {
    quality: '720p', 
    src: '/video-720p.mp4',
    type: 'video/mp4'
  },
  {
    quality: '480p',
    src: '/video-480p.mp4',
    type: 'video/mp4'
  }
];

<VideoPlayer
  sources={sources}
  poster="/poster.jpg"
  initialQuality="720p"
  initialVolume={0.8}
  theaterDefault={false}
  autoPlay={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sources` | `Array<Source>` | `[]` | Array of video source objects |
| `poster` | `string` | - | Poster image URL |
| `initialQuality` | `string` | - | Default quality to start with |
| `initialVolume` | `number` | `0.9` | Initial volume (0-1) |
| `theaterDefault` | `boolean` | `false` | Start in theater mode |
| `autoPlay` | `boolean` | `false` | Auto-play when ready |
| `className` | `string` | `""` | Additional CSS classes |

### Source Object

```typescript
type Source = {
  quality: string;    // e.g., "1080p", "720p", "480p"
  src: string;        // Video file URL
  type?: string;      // MIME type (default: "video/mp4")
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `K` | Play/Pause |
| `←` / `→` | Seek backward/forward 5s |
| `↑` / `↓` | Volume up/down |
| `M` | Toggle mute |
| `F` | Toggle fullscreen |
| `T` | Toggle theater mode |
| `,` / `.` | Decrease/increase speed |
| `0-9` | Seek to percentage of video |

## Architecture

### Files Structure
```
video/
├── VideoPlayer.jsx          # Main component
├── VideoPlayer.module.css   # Component styles
├── useVideoPlayer.js        # Custom hook with logic
└── README.md               # This file
```

### Separation of Concerns
- **VideoPlayer.jsx** - UI and presentation logic
- **useVideoPlayer.js** - Video state management and actions
- **VideoPlayer.module.css** - Styling and responsive design

## Browser Support

- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## Security Features

- Disabled context menu on video element
- No native browser controls exposed
- `controlsList` prevents download/PiP options
- Right-click protection

## Accessibility

- Full keyboard navigation
- ARIA labels and roles
- Screen reader announcements
- Focus management
- High contrast support

## Customization

The component uses CSS modules for styling. You can:

1. **Override styles** by providing custom CSS classes via `className` prop
2. **Modify colors** by editing `VideoPlayer.module.css` 
3. **Add custom controls** by extending the component
4. **Change behavior** by modifying `useVideoPlayer.js`

## Demo

See `VideoPlayerDemo.jsx` for a complete example with:
- Multiple video qualities
- Feature showcase
- Keyboard shortcuts guide
- Usage examples

## Dependencies

- React 16.8+ (for hooks)
- Modern CSS support (CSS modules)
- No external video libraries required

## Performance

- Lightweight (~5KB minified)
- Efficient state management
- Optimized re-renders
- Smooth 60fps animations