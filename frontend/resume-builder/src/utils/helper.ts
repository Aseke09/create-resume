import moment from 'moment'
import html2canvas from 'html2canvas'
import type { LocalizedString } from './localization';

export const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getLightColorFromImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        if (!imageUrl || typeof imageUrl !== 'string') {
            return reject(new Error('Invalid image URL'));
        }

        const img = new Image();

        if (!imageUrl.startsWith('data')) {
            img.crossOrigin = 'anonymous';
        }
        
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              return reject(new Error('Unable to get 2D context from canvas.'));
      }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let r = 0, g = 0, b = 0, count = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                const red = imageData[i];
                const green = imageData[i + 1];
                const blue = imageData[i + 2];
                const brightness = (red + green + blue) / 3;

                if (brightness > 100) {
                    r += red;
                    g += green;
                    b += blue;
                    count++;
                }
            }

            if (count === 0) {
                resolve('#ffffff');
            } else {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                resolve(`rgb(${r}, ${g}, ${b})`);
            }
        };

        img.onerror = (e) => {
            console.warn('Failed to load image:', e)
            reject(new Error('Image could not be loaded or is blocked by CORS.'))
        };
    });
};

export function formatYearMonth(yearMonth: string) {
    return yearMonth ? moment(yearMonth, 'YYYY-MM').format('MMM YYYY') : '';
}

export const fixTailwindColors = (element: HTMLElement) => {
  const elements = element.querySelectorAll<HTMLElement>('*');

  elements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);

    for (let i = 0; i < computedStyle.length; i++) {
      const prop = computedStyle.item(i); // This gives you a CSS property name like "color", "backgroundColor", etc.
      const value = computedStyle.getPropertyValue(prop);

      if (value.includes('oklch')) {
        const lowerProp = prop.toLowerCase();
        const safeFallback = lowerProp.includes('background') ? '#fff' : '#000';
        el.style.setProperty(prop, safeFallback, computedStyle.getPropertyPriority(prop));
      }
    }
  });
};

export async function captureElementAsImage(element: HTMLElement): Promise<string> {
  if (!element) throw new Error('No element provided');

  const scaleFactor = 0.5;

  const canvas = await html2canvas(element, { scale: scaleFactor });
  return canvas.toDataURL('image/png', 0.6);
}

export const dataURLtoFile = (dataUrl: string, fileName: string): File => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error('Invalid data URL');
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
};

export const isLocalizedStringFilled = (val: LocalizedString): boolean => {
  return Object.values(val).some((v) => v?.trim?.());
};

export const sanitizeFilename = (name: string): string =>
  name.replace(/[^a-z0-9_.-]/gi, '_'); 