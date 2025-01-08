export function caltimeAgo(timeString: string): string {
    const time = new Date(timeString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    const oneMonth = 30 * 24 * 60 * 60;
  
    if (seconds < 0) {
        return "in the future";
    }
  
    if (seconds < 5) {
      return "now";
    }
  
    if (seconds >= oneMonth) {
      return `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
    }
  
  
    let interval = Math.floor(seconds / 3600);
  
    if (interval >= 24) {
      const days = Math.floor(interval / 24);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }
  
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;
    }
  
  
    interval = Math.floor(seconds / 60);
  
    if (interval >= 1) {
       return `${interval} minute${interval === 1 ? "" : "s"} ago`;
    }
  
  
      return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }