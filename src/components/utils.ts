export function getBrowserName() {

  var s = navigator.userAgent.toLowerCase();

  // ok, its not a tablet or a phone, just return browser name

  if (s.indexOf("firefox") > -1)
      return "firefox";

  if (s.indexOf("chrome") > -1)
      return "chrome";

  if (s.indexOf("msie") > -1)
      return "msie";

  if (s.indexOf("trident") > -1)      // dont search for windows as safari user agent string contains the word window
      return "msie";

  if (s.indexOf("safari") > -1)
      return "safari";

  if (s.indexOf("opera") > -1)
      return "opera";

  return "unknown";
}