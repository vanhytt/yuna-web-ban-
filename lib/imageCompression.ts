/**
 * Utility function to compress images using HTML5 Canvas directly in the browser.
 * Resizes the image to a maximum of 1200px (width or height) and compresses
 * it to a .webp format, keeping the file size below 300KB (0.3MB).
 */
export async function compressImage(file: File): Promise<File> {
  // If the browser doesn't support HTML5 canvas or FileReader, return the original file.
  if (typeof window === "undefined" || !window.FileReader || !window.HTMLCanvasElement) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize maximum dimension to 1200px
        const MAX_DIMENSION = 1200;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress and convert to webp under 300KB
        let quality = 0.85;
        const targetSize = 300 * 1024; // 300KB in bytes

        const attemptCompression = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              // If file is still > 300KB and quality is above 0.1, try lower quality
              if (blob.size > targetSize && q > 0.1) {
                attemptCompression(q - 0.15);
              } else {
                // Convert blob back to a File object with .webp extension
                const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
                const newFile = new File([blob], `${originalName}.webp`, {
                  type: "image/webp",
                  lastModified: Date.now(),
                });
                resolve(newFile);
              }
            },
            "image/webp",
            q
          );
        };

        attemptCompression(quality);
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}