const colorThief = new ColorThief();
const iconElement = document.getElementById('icon');
// iconElement.crossOrigin = 'anonymous';

function applyColorsFromImage(imgElement) {
    if (!imgElement.complete) {
        console.error('Image not fully loaded!');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

    try {
        const dominantColor = colorThief.getColor(canvas);
        const dominantColorRgb = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

        document.documentElement.style.setProperty('--accent-color', lighterTextColor);
        const textColor = adjustColorBrightness(dominantColorRgb, -50);
        const lighterTextColor = adjustColorBrightness(dominantColorRgb, 20);
        const iconColor = dominantColorRgb;
        document.documentElement.style.setProperty('--text-color', iconColor);
        document.documentElement.style.setProperty('--text-color-light', lighterTextColor);
        document.documentElement.style.setProperty('--icon-color', iconColor);
        document.documentElement.style.setProperty('--scroll-bar', dominantColorRgb);

        const darkenedBackgroundColor = adjustColorBrightness(dominantColorRgb, -80);
        document.documentElement.style.setProperty('--bg-color', darkenedBackgroundColor);

        document.body.style.backgroundColor = darkenedBackgroundColor;

        const cursorFilter = rgbToFilter(lighterTextColor);

        console.log('Colors and cursors applied based on the image:', {
            dominantColor: dominantColorRgb,
            textColor: textColor,
            lighterTextColor: lighterTextColor,
            iconColor: iconColor,
            darkenedBackgroundColor: darkenedBackgroundColor,
            cursorFilter: cursorFilter
        });
    } catch (error) {
        console.error('Error extracting colors from the image:', error);
    }
}

function rgbToFilter(rgbColor) {
    const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
    const normalizedColor = [r / 255, g / 255, b / 255];

    return `invert(100%) sepia(100%) saturate(10000%) hue-rotate(${Math.atan2(normalizedColor[1] - normalizedColor[0], normalizedColor[2] - normalizedColor[0])}deg)`;
}

function adjustColorBrightness(rgbColor, amount) {
    const rgb = rgbColor.match(/\d+/g).map(Number);
    const r = Math.min(Math.max(rgb[0] + amount, 0), 255);
    const g = Math.min(Math.max(rgb[1] + amount, 0), 255);
    const b = Math.min(Math.max(rgb[2] + amount, 0), 255);
    return `rgb(${r}, ${g}, ${b})`;
}

iconElement.onload = applyColorsFromImage(iconElement);
