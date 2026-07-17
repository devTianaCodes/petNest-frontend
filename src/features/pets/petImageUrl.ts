const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_PATH = "/image/upload/";
const PETNEST_DEMO_IMAGE_PATH = /^\/success-stories\/story[1-4][AB]\.png$/;

export function getOptimizedPetImageUrl(imageUrl: string, width: number) {
  if (!Number.isFinite(width) || width <= 0) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.hostname === "petnest-frontend.vercel.app" && PETNEST_DEMO_IMAGE_PATH.test(url.pathname)) {
      return url.pathname.replace(/\.png$/, ".jpg");
    }

    if (url.hostname !== CLOUDINARY_HOST || !url.pathname.includes(CLOUDINARY_UPLOAD_PATH)) {
      return imageUrl;
    }

    const transformation = `f_auto,q_auto:eco,c_limit,w_${Math.round(width)}`;
    url.pathname = url.pathname.replace(
      CLOUDINARY_UPLOAD_PATH,
      `${CLOUDINARY_UPLOAD_PATH}${transformation}/`
    );

    return url.toString();
  } catch {
    return imageUrl;
  }
}
