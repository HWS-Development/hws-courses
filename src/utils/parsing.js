export function splitToList(str) {
    if (!str) return [];
    return String(str)
      .split(/\n|,/g)   // split by newline or comma
      .map(s => s.trim())
      .filter(Boolean);
  }
  
  export function youtubeIdFromUrl(url) {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || '';
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    } catch (e) {
        console.log(e);
        
      // ignore invalid URLs (return empty string)
    }
    return '';
  }
  
  export function youtubeThumbFromUrl(url) {
    const id = youtubeIdFromUrl(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }
  