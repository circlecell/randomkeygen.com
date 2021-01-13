import $ from 'balajs';

const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '1234567890';
const special = '`~!@#$%^&*()-=_+[]{}|;\':",./<>?';
const hex = '123456789ABCDEF';

function random() {
  const { crypto, Uint32Array } = window;
  if (typeof crypto?.getRandomValues === 'function' && typeof Uint32Array === 'function') {
    // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
  }

  return Math.random();
}

function keyGen(
  length,
  useLowerCase = true,
  useUpperCase = true,
  useNumbers = true,
  useSpecial = true,
  useHex = false
) {
  let chars = '';
  let key = '';

  if (useLowerCase) chars += lowerCase;
  if (useUpperCase) chars += upperCase;
  if (useNumbers) chars += numbers;
  if (useSpecial) chars += special;
  if (useHex) chars += hex;

  for (let i = 0; i < length; i++) {
    key += chars[Math.floor(random() * chars.length)];
  }

  return key;
}

function getKey(strength) {
  switch (strength) {
  case 'decent_pw':
    return keyGen(10, true, true, true, false, false);
  case 'strong_pw':
    return keyGen(15, true, true, true, true, false);
  case 'ft_knox_pw':
    return keyGen(30, true, true, true, true, false);
  case 'ci_key':
    return keyGen(32, true, true, true, false, false);
  case '160_wpa':
    return keyGen(20, true, true, true, true, false);
  case '504_wpa':
    return keyGen(63, true, true, true, true, false);
  case '64_wep':
    return keyGen(5, false, false, false, false, true);
  case '128_wep':
    return keyGen(13, false, false, false, false, true);
  case '152_wep':
    return keyGen(16, false, false, false, false, true);
  case '256_wep':
    return keyGen(29, false, false, false, false, true);
  default:
    throw Error(`No such strength "${strength}"`);
  }
}

function blinkCopied(node) {
  const { top, left } = node.getBoundingClientRect();
  const { offsetHeight, offsetWidth } = node;
  const { scrollX, scrollY } = window;
  const blinkNode = $.one('.blink-copied');

  blinkNode.style.top = `${top + offsetHeight + scrollY}px`;
  blinkNode.style.left = `${left + offsetWidth / 2 - 40 + scrollX}px`;

  blinkNode.classList.add('active');

  setTimeout(() => blinkNode.classList.remove('active'), 100);
}

for (const node of $('input[data-strength]')) {
  node.value = getKey(node.dataset.strength);
  node.addEventListener('focus', () => {
    node.select();
    document.execCommand('copy');
    blinkCopied(node);
  });
}
