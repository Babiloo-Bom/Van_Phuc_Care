// Timestamp for 6 hours ago
const sixHoursAgo = new Date();
sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
const timestampSixHoursAgo = sixHoursAgo.getTime();

// Timestamp for today (current time)
const timestampToday = Date.now();

console.log("Timestamp for 6 hours ago:", timestampSixHoursAgo);
console.log("Timestamp for today:", timestampToday);
