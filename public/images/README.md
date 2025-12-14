# Images Folder

This folder is for storing product images locally.

## Current Setup

Currently, images are stored as **external URLs** in the `src/components/ProductGrid.js` file. The image URLs point to Unsplash.

## To Use Local Images

1. Place your image files in this `public/images/` folder
2. Update the image paths in `src/components/ProductGrid.js` to use:
   - `/images/matcha-mochi.jpg` (for example)
   - Note: Use `/images/` (not `./images/`) since files in `public/` are served from the root

## Example

If you have a file `matcha-mochi.jpg` in this folder, use:
```javascript
image: '/images/matcha-mochi.jpg'
```

