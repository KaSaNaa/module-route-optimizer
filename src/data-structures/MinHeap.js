export class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(key, value) {
    this.heap.push({ key, value });
    this.siftUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return undefined;

    this.swap(0, this.heap.length - 1);
    const min = this.heap.pop();
    if (this.heap.length > 0) this.siftDown(0);

    return min;
  }

  decreaseKey(value, newKey) {
    const idx = this.heap.findIndex((e) => e.value === value);
    if (idx === -1) return false;

    if (newKey >= this.heap[idx].key) return true;

    this.heap[idx].key = newKey;
    this.siftUp(idx);
    return true;
  }

  peek() {
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  get size() {
    return this.heap.length;
  }

  siftUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent].key <= this.heap[idx].key) break;
      this.swap(parent, idx);
      idx = parent;
    }
  }

  siftDown(idx) {
    const n = this.heap.length;

    while (true) {
      const left  = 2 * idx + 1;
      const right = 2 * idx + 2;
      let smallest = idx;

      if (left < n && this.heap[left].key < this.heap[smallest].key) {
        smallest = left;
      }
      if (right < n && this.heap[right].key < this.heap[smallest].key) {
        smallest = right;
      }

      if (smallest === idx) break;

      this.swap(idx, smallest);
      idx = smallest;
    }
  }

  swap(i, j) {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }
}
