class QNode<T> {
  private readonly value: T | undefined;
  private prev: QNode<T> | undefined;
  private next: QNode<T> | undefined;

  constructor(value?: T, prev?: QNode<T>, next?: QNode<T>) {
    this.value = value;
    if (prev) this.setPrev(prev);
    if (next) this.setNext(next);
  }

  isEmpty(): boolean {
    return this.value === undefined;
  }

  getValue(): T {
    if (this.isEmpty()) throw new Error("empty qnode");
    return this.value as T;
  }

  getPrev(): QNode<T> {
    if (this.prev === undefined) throw new Error("qnode has no preceding qnode");
    return this.prev;
  }

  setPrev(node: QNode<T> | undefined) {
    this.prev = node;
    if (node) node.next = this;
  }

  getNext(): QNode<T> {
    if (this.next === undefined) throw new Error("qnode has no next qnode");
    return this.next;
  }

  setNext(node: QNode<T> | undefined) {
    this.next = node;
    if (node) node.prev = this;
  }
}

export class Queue<T> {
  private head = new QNode<T>();
  private tail = new QNode<T>(undefined, this.head);

  isEmpty(): boolean {
    return this.head.isEmpty();
  }

  length(): number {
    let n = 0;
    let node = this.head;
    while (!node.isEmpty()) (node = node.getNext()), n++;
    return n;
  }

  push(value: T) {
    const node = new QNode(value, this.tail.getPrev(), this.tail);
    if (this.isEmpty()) (this.head = node).setPrev(undefined);
  }

  peak(): T {
    return this.head.getValue();
  }

  pop(): T {
    const value = this.head.getValue();
    (this.head = this.head.getNext()).setPrev(undefined);
    if (this.head === this.tail) this.tail = new QNode<T>(undefined, this.head);
    return value;
  }

  find(f: (value: T) => boolean): T | undefined {
    let node = this.head;
    while (!node.isEmpty()) {
      const v = node.getValue();
      if (f(v)) return v;
      node = node.getNext();
    }
    return undefined;
  }

  toArray(): T[] {
    const arr = [];
    let node = this.head;
    while (!node.isEmpty()) arr.push(node.getValue()), (node = node.getNext());
    return arr;
  }
}

export class ProperDate extends Date {
  dayOf() {
    return this.getDate();
  }
  monthOf() {
    return this.getMonth() + 1;
  }
  yearOf() {
    return this.getFullYear();
  }
}
