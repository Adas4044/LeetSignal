# 🐎 Adding Horse Sprites Guide

## Folder Structure

Your horse sprites are organized in the `/web/assets/` folder:

```
assets/
├── horse1/
│   └── transparent/
│       └── (animation frames)
├── horse2/
│   └── (animation frames)
├── horse3/
│   └── transparent/
│       └── (copied from horse1)
├── horse4/
│   └── transparent/
│       └── placeholder.png (ready for your sprites)
├── horse5/
│   └── transparent/
│       └── placeholder.png
...
├── horse10/
│   └── transparent/
│       └── placeholder.png
└── placeholder.svg (default placeholder)
```

## Adding New Horse Animations

### For Horses 4-10:

1. **Add your animation frames** to the appropriate `horse{N}/transparent/` folder
2. **Update the CSS** in `/web/styles.css`:

```css
/* Replace the placeholder */
.horse-4 { background-image: url('./assets/horse4/transparent/frame1.png'); }

/* Add animation keyframes */
@keyframes gallop-cycle-4 {
    0% { background-image: url('./assets/horse4/transparent/frame1.png'); }
    25% { background-image: url('./assets/horse4/transparent/frame2.png'); }
    50% { background-image: url('./assets/horse4/transparent/frame3.png'); }
    75% { background-image: url('./assets/horse4/transparent/frame4.png'); }
    100% { background-image: url('./assets/horse4/transparent/frame1.png'); }
}

/* Update the racing animation */
.horse-4.racing { animation: gallop-cycle-4 0.8s infinite; }
```

### Animation Frame Naming

For consistency, name your animation frames:
- `frame1.png`, `frame2.png`, etc., OR
- `animation1.png`, `animation2.png`, etc., OR
- Use descriptive names like `gallop1.png`, `gallop2.png`

### Recommended Specifications

- **Size**: 48x48 pixels (or larger, CSS will scale)
- **Format**: PNG with transparency
- **Frames**: 3-6 frames per animation cycle
- **Style**: Match the existing horses' art style

## Current Horse Status

✅ **Horse 1**: Brown horse with transparent frames (4 frames)
✅ **Horse 2**: Different horse with animation1-5.png (5 frames)  
✅ **Horse 3**: Copy of Horse 1 (placeholder)
🔄 **Horses 4-10**: Ready for your sprites!

## Testing Your Sprites

1. Add your images to the appropriate folder
2. Update the CSS with the correct paths
3. Refresh the racing game
4. Configure usernames and test with the increment button

## Cache System

The game now includes a local cache system that:
- **Saves LeetCode data** locally in your browser
- **Persists between sessions** - data survives page refresh/browser close
- **Auto-expires after 24 hours** to ensure fresh data
- **Falls back to cache** if API is unavailable
- **Can be cleared manually** with the "Clear Cache" button

### Cache Benefits:
- Faster loading (uses cached data when fresh enough)
- Works offline with previously cached data
- Reduces API calls
- Better user experience

The cache status is shown in the "Last update" line, e.g.:
`Last update: 10:30:45 PM (2/3 cached)`

Ready to add your horse sprites! 🏇