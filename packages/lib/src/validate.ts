/**
 * 验证工具函数
 */

/**
 * 验证邮箱格式
 */
export function isEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 */
export function isPhoneNumber(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

/**
 * 验证 URL 格式
 */
export function isURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证身份证号格式（中国大陆）
 */
export function isIDCard(idCard: string): boolean {
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!reg.test(idCard)) return false;

  // 校验码验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }
  const checkCode = checkCodes[sum % 11];
  return checkCode === idCard[17].toUpperCase();
}

/**
 * 验证 IP 地址格式
 */
export function isIPAddress(ip: string): boolean {
  const reg = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!reg.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * 验证密码强度（至少包含大写字母、小写字母、数字，长度至少 8 位）
 */
export function isStrongPassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
}

/**
 * 验证是否为数字
 */
export function isNumeric(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}

/**
 * 验证是否为整数
 */
export function isInteger(value: string | number): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 验证信用卡号（Luhn 算法）
 */
export function isCreditCard(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(sanitized)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * 验证 MAC 地址
 */
export function isMACAddress(mac: string): boolean {
  const reg = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return reg.test(mac);
}

/**
 * 验证 IPv6 地址
 */
export function isIPv6(ip: string): boolean {
  const reg = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::)$/;
  return reg.test(ip);
}
