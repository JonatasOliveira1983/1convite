function optimizeImageUrl(url, width, quality = "auto") {
  if (!url) return "";
  if (url.includes("res.cloudinary.com/")) {
    const uploadIndex = url.indexOf("/image/upload/");
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 14);
      const suffix = url.substring(uploadIndex + 14);
      if (suffix.match(/q_[a-z0-9]+/i)) {
        return url;
      }
      const transformations = [
        `q_${quality}`
        // qualidade automática
      ];
      if (width) {
        transformations.push(`w_${width}`);
        transformations.push("c_limit");
      }
      return `${prefix}${transformations.join(",")}/${suffix}`;
    }
  }
  return url;
}

export { optimizeImageUrl as o };
//# sourceMappingURL=image-optimizer-CgaByzvi.js.map
