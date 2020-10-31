const getTemplate = (placeholder, data, selectedId) => {
  let text = placeholder ?? '' // Если placeholder нет, то пустота

  const items = data.map(item => {
    if (item.id === selectedId) { // Если есть параметр selectedId, выбираем его по умолчанию
      text = item.value;
    }
    return `<li tabindex="0" class="select__item" data-type='item' data-id='${item.id}'>${item.value}</li>`
  });

  return `
    <div tabindex="0" class="select__input" data-type='input'>
      <span class="select__placeholder" data-type='value'>${text}</span>
      <i class="fas fa-angle-up"></i>
    </div>
    <ul class="select__body">
      ${items.join('')}
    </ul>
  `
};

export default class select {
  constructor(selector, options) {
  this.select = document.querySelector(selector);
  this.options = options // 1. чтобы опции были доступны в плагине
  this.selectedId = options.selectedId; // Забираем из html selectedId
  this.render();
  this.setup();
}

render() {
  const {placeholder, data} = this.options // 2. забираем placeholder, data
  this.select.classList.add('select');
  this.select.innerHTML = getTemplate(placeholder, data, this.selectedId); // 3. передаем placeholder и data в шаблон
}

setup() {
  this.clickHandler = this.clickHandler.bind(this);
  this.select.addEventListener('click', this.clickHandler);
  this.angle = this.select.querySelector('.fa-angle-up');
  this.value = this.select.querySelector('[data-type="value"]');
  document.body.addEventListener('click', (event) => {
    if (!event.target.classList.contains('select__input') && !event.target.classList.contains('select__item')) {
      this.close();
    }
  });
}

clickHandler(event) {
  const { type } = event.target.dataset;
  if (type === 'input') {
    this.toggle();
  } else if (type === 'item') {
    const id = event.target.dataset.id;
    this.selected(id);
    this.close();
  }
};

get current() {
  return this.options.data.find(item => item.id === this.selectedId);
}

selected(id) {
  this.selectedId = id;
  this.value.textContent = this.current.value;
};

get isOpen() {
  return this.select.classList.contains('is-opened');
}

toggle() {
  this.isOpen ? this.close() : this.open();
}

open() {
  this.select.classList.add('is-opened');
  this.angle.classList.remove('fa-angle-up');
  this.angle.classList.add('fa-angle-down');
}

close() {
  this.select.classList.remove('is-opened');
  this.angle.classList.remove('fa-angle-down');
  this.angle.classList.add('fa-angle-up');
}

destroy() {
  this.select.removeEventListener('click', this.clickHandler);
}
};
