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
