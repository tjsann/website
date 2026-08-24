const $ = (id) => document.getElementById(id);
const sheet = $('confirmSheet');
const backdrop = $('backdrop');
const entered = $('enteredPanel');
const admit = $('admitButton');

function toggleSheet(show) {
  sheet.hidden = !show;
  backdrop.hidden = !show;
  document.body.style.overflow = show ? 'hidden' : '';
}

admit.addEventListener('click', () => toggleSheet(true));
$('cancelButton').addEventListener('click', () => toggleSheet(false));
backdrop.addEventListener('click', () => toggleSheet(false));
$('confirmButton').addEventListener('click', () => {
  toggleSheet(false);
  entered.hidden = false;
  admit.disabled = true;
  admit.textContent = 'デモ入場済み';
  admit.style.background = '#777';
});
$('resetButton').addEventListener('click', () => {
  entered.hidden = true;
  admit.disabled = false;
  admit.innerHTML = 'デモ入場する<small>（実際の入場処理は行いません）</small>';
  admit.style.background = '';
});
$('detailButton').addEventListener('click', () => alert('デモ用の詳細画面です。\n実システムには接続されていません。'));
