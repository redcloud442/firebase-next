export const formatCustom = (dateString: string) => {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12; // Convert 0 -> 12

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(hour12)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${ampm}`;
};

export const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const parseDuration = (duration: string): number => {
  if (!duration) return 0;
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};
