// Shared helpers for post-related components

//check if the visiblle events are saved: showing saved status
export async function checkSaves(eventIds) {
    if (!eventIds.length) return [];
    try {
        const res = await fetch(`/ad-posts/saves/check?eventIds=${eventIds.join(",")}`, {
            credentials: "include",
        });
        if (!res.ok) return [];
        return await res.json(); // array of saved eventIds
    } catch {
        return [];
    }
}

//check if the visiblle posts are liked: showing liked status
export async function checkLikes(postIds) {
    if (!postIds.length) return [];
    try {
        const res = await fetch(`/ad-posts/likes/check?postIds=${postIds.join(",")}`, {
            credentials: "include",
        });
        if (!res.ok) return [];
        return await res.json(); // array of liked postIds
    } catch {
        return [];
    }
}

//format date to readable format
export function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr.replace(" ", "T"));
    return date
        .toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replace(",", "");
}

//translate imageUrls from backend to presentable frontend Urls
export function resolveImageUrl(src) {
    return src.startsWith("uploads/") ? `/${src}` : src;
}
