export const queryKeys = {
  homeVideos: (category) => ["videos", "home", category || ""],
  video: (videoId) => ["videos", "detail", videoId],
  userVideos: (userId) => ["videos", "byUser", userId],
  suggestedVideos: (videoId, title) => ["videos", "suggested", videoId, title],
  searchVideos: (query) => ["videos", "search", query],

  comments: (videoId) => ["comments", videoId],

  channel: (username) => ["channel", username],

  subscribedTo: (userId) => ["subscriptions", "subscribedTo", userId],
  subscribers: (userId) => ["subscriptions", "subscribers", userId],

  likedVideos: () => ["likes", "videos"],

  courses: (userId) => ["courses", userId],

  tweets: (userId) => ["tweets", userId],

  history: () => ["history"],
};
