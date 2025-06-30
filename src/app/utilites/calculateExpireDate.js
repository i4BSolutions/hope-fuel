export default function calculateExpireDate(
  currentExpireDate, // The current expiration date (assumed to be at the end of the month)
  month, // The number of months to add to the current expiration date
  hasExpired // A boolean indicating whether the current expiration date has already passed
) {
  // If currentExpireDate is null, set expiration to current date + month parameter - 1
  if (currentExpireDate === null) {
    const currentDate = new Date();
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + month,
      0 // Set the date to the last day of the resulting month
    );
  }

  // If the current expiration date has already passed
  if (hasExpired) {
    return new Date(
      currentExpireDate.getFullYear(), // Keep the same year
      currentExpireDate.getMonth() + month, // Add the specified number of months
      0 // Set the date to the last day of the resulting month
    );
  } else {
    // If the current expiration date has not passed
    return new Date(
      currentExpireDate.getFullYear(), // Keep the same year
      currentExpireDate.getMonth() + month + 1, // Add the specified number of months plus one
      0 // Set the date to the last day of the resulting month
    );
  }
}
