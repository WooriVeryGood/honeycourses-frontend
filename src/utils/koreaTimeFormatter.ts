const koreaTimeFormatter = (text: string) => {
  const dateA = new Date("2022/06/01 08:00:00");
  const dateB = new Date("2022/06/01 00:00:00");
  const diffMSec = dateA.getTime() - dateB.getTime();

  const koreaTime = new Date(text).getTime() + diffMSec;

  const dateString = new Date(koreaTime).toLocaleDateString();
  const timeString = new Date(koreaTime).toLocaleTimeString();

  return dateString + " " + timeString;
}

export default koreaTimeFormatter;