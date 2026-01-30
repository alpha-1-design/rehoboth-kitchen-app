export const validateGhanaPhone = (phone) => {
  // Removes spaces and dashes
  const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
  
  // Ghana Regex: Starts with 02, 05, or +233, followed by correct digits
  // MTN: 024, 054, 055, 059, 025
  // Voda/Telecel: 020, 050
  // AT/AirtelTigo: 027, 057, 026, 056
  
  const ghanaRegex = /^(0(2[0345678]|5[0345679])[0-9]{7})$/;
  
  if (!ghanaRegex.test(cleanPhone)) {
    return { isValid: false, message: "Invalid Ghana Number (e.g. 024 123 4567)" };
  }
  return { isValid: true, message: "" };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid Email Address" };
  }
  return { isValid: true, message: "" };
};
