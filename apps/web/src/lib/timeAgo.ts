export function caltimeAgo(timeString: string): string {
    const time = new Date(timeString);
    const now = new Date();
    const seconds: number = Math.floor((now.getTime() - time.getTime()) / 1000);
    const oneMonth = 30 * 24 * 60 * 60;
    if (seconds >= oneMonth) {
        return `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
    } 

    let interval = Math.floor(seconds / 3600);
    if (interval >= 24) {
        const days = Math.floor(interval / 24);
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    
    if (interval >= 1) {
        return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }

    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
}
