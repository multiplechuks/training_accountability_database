/**
 * Date and time formatting utilities for the Training Management System
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  format?: "short" | "medium" | "long" | "full";
  locale?: string;
}

/**
 * Formats a date string or Date object to a localized date string
 * @param date - The date to format (string, Date, or null/undefined)
 * @param options - Formatting options
 * @returns Formatted date string or fallback text
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: DateFormatOptions = {}
): string {
  if (!date) {
    return "Not provided";
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const {
      includeTime = false,
      format = "medium",
      locale = "en-US"
    } = options;

    const formatOptions: Intl.DateTimeFormatOptions = {};

    // Date format options
    switch (format) {
      case "short":
        formatOptions.year = "numeric";
        formatOptions.month = "2-digit";
        formatOptions.day = "2-digit";
        break;
      case "medium":
        formatOptions.year = "numeric";
        formatOptions.month = "short";
        formatOptions.day = "numeric";
        break;
      case "long":
        formatOptions.year = "numeric";
        formatOptions.month = "long";
        formatOptions.day = "numeric";
        break;
      case "full":
        formatOptions.weekday = "long";
        formatOptions.year = "numeric";
        formatOptions.month = "long";
        formatOptions.day = "numeric";
        break;
    }

    // Time format options
    if (includeTime) {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
      formatOptions.hour12 = true;
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Formats a date for display in tables (short format)
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export function formatTableDate(date: string | Date | null | undefined): string {
  return formatDate(date, { format: "medium" });
}

/**
 * Formats a date for detailed views (long format)
 * @param date - The date to format
 * @returns Formatted date string (e.g., "January 15, 2025")
 */
export function formatDetailDate(date: string | Date | null | undefined): string {
  return formatDate(date, { format: "long" });
}

/**
 * Formats a datetime for display with time
 * @param date - The date to format
 * @returns Formatted datetime string (e.g., "Jan 15, 2025, 2:30 PM")
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, { format: "medium", includeTime: true });
}

/**
 * Formats a date for form inputs (YYYY-MM-DD format)
 * @param date - The date to format
 * @returns Formatted date string for input fields
 */
export function formatInputDate(date: string | Date | null | undefined): string {
  if (!date) {
    return "";
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "";
    }

    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting input date:", error);
    return "";
  }
}

/**
 * Calculates age from date of birth
 * @param dateOfBirth - The date of birth
 * @returns Age in years or null if invalid
 */
export function calculateAge(dateOfBirth: string | Date | null | undefined): number | null {
  if (!dateOfBirth) {
    return null;
  }

  try {
    const dobObj = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
    
    if (isNaN(dobObj.getTime())) {
      return null;
    }

    const today = new Date();
    let age = today.getFullYear() - dobObj.getFullYear();
    const monthDiff = today.getMonth() - dobObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobObj.getDate())) {
      age--;
    }

    return age >= 0 ? age : null;
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
}

/**
 * Formats date of birth with age
 * @param dateOfBirth - The date of birth
 * @returns Formatted string with date and age (e.g., "Jan 15, 1990 (35 years)")
 */
export function formatDateOfBirthWithAge(dateOfBirth: string | Date | null | undefined): string {
  const formattedDate = formatTableDate(dateOfBirth);
  const age = calculateAge(dateOfBirth);
  
  if (formattedDate === "Not provided" || formattedDate === "Invalid date") {
    return formattedDate;
  }
  
  if (age !== null) {
    return `${formattedDate} (${age} years)`;
  }
  
  return formattedDate;
}

/**
 * Gets relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - The date to compare
 * @param locale - Locale for formatting
 * @returns Relative time string
 */
export function getRelativeTime(
  date: string | Date | null | undefined,
  locale: string = "en-US"
): string {
  if (!date) {
    return "Unknown time";
  }

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid time";
    }

    const now = new Date();
    const diffInMs = dateObj.getTime() - now.getTime();
    const diffInSeconds = Math.abs(diffInMs) / 1000;
    const isPast = diffInMs < 0;

    let value: number;
    let unit: Intl.RelativeTimeFormatUnit;

    if (diffInSeconds < 60) {
      value = Math.floor(diffInSeconds);
      unit = "second";
    } else if (diffInSeconds < 3600) {
      value = Math.floor(diffInSeconds / 60);
      unit = "minute";
    } else if (diffInSeconds < 86400) {
      value = Math.floor(diffInSeconds / 3600);
      unit = "hour";
    } else if (diffInSeconds < 2592000) {
      value = Math.floor(diffInSeconds / 86400);
      unit = "day";
    } else if (diffInSeconds < 31536000) {
      value = Math.floor(diffInSeconds / 2592000);
      unit = "month";
    } else {
      value = Math.floor(diffInSeconds / 31536000);
      unit = "year";
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    return rtf.format(isPast ? -value : value, unit);
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "Unknown time";
  }
}