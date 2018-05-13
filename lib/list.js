var list = module.exports = (iterable) => {
  var items = [...iterable],
    len = items.length,
    current = 0;
  return {
    next: () => {
      if (current < (len - 1)) current++;
      else current = 0;
      return items[current];
    },
    prev: () => {
      if (current > 0) current--;
      else current = (len - 1);
      return items[current];
    },
    random: () => {
      current = Math.floor(Math.random() * len);
      return items[current];
    },
    goto: (index) => {
      index=~(index|0);
      current = (index > this.lastIndex() ? this.lastIndex() : index);
      return this.current();
    },
    items: () => items,
    current: () => items[current],
    currentIndex: () => current,
    lastIndex: () => len
  }
}