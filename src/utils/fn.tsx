import moment from "moment";

export function formatMoney(number: number | undefined) {
  return number?.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
}

export const formatNumberWithCommas = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};
export const formatDateFunc = {
  formatDateTime: (date: Date | undefined): string => {
    return moment(date, moment.ISO_8601).format("DD/MM/YYYY HH:mm a");
  },
  formatDate: (date: Date | undefined): string => {
    return moment(date, moment.ISO_8601).format("DD/MM/YYYY");
  },
  formatTime: (date: Date | undefined): string => {
    return moment(date, moment.ISO_8601).format("HH:mm A");
  },
  formatDateVietnamese: (date: Date | undefined): string => {
    if (!date) return "";
    const momentDate = moment(date, moment.ISO_8601);
    const day = momentDate.format("DD");
    const month = momentDate.format("MM");
    const year = momentDate.format("YYYY");
    return `Ký ngày ${day}, tháng ${month}, năm ${year}`;
  },
};

export function truncate(text: string | undefined) {
  const textString = text?.toString();

  if (typeof textString === "string" && textString.length > 20) {
    const truncateText = textString.substring(0, 20);
    return truncateText + "...";
  }
  return textString;
}

//change the router link
export function navigateId(
  route: string,
  suffix: string,
  suffixChange: string | undefined
) {
  const id = suffixChange?.toString();
  if (typeof id === "string") {
    return route.replace(suffix, id);
  }
  return route.replace(suffix, "");
}

// Helper function to format date for input field
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

// Helper function to convert input date to ISO string
export const convertDateToISO = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00.000Z");
  return date.toISOString();
};

// Helper function to validate if date is in the future
export const isDateInFuture = (dateString: string): boolean => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
