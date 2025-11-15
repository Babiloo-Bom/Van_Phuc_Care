// Timestamp for 6 hours ago
const sixHoursAgo = new Date();
sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
const timestampSixHoursAgo = sixHoursAgo.getTime();

// Timestamp for today (current time)
const timestampToday = Date.now();
