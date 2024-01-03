import { Queue } from "../src/util";


describe("Queue", () => {
  it("throws error if pop is called on an empty queue", () => {
    const q = new Queue<number>();
    expect(q.isEmpty()).toBe(true);
    expect(() => q.pop()).toThrow();
  });

  it("pushes and pops a single value", () => {
    const q = new Queue<number>();
    q.push(5);
    expect(q.isEmpty()).toBe(false);
    expect(q.pop()).toBe(5);
    expect(q.isEmpty()).toBe(true);
  });

  it("pushes miltiple values and pops them in order", () => {
    const q = new Queue<number>();
    q.push(3);
    q.push(4);
    expect(q.pop()).toBe(3);
    expect(q.pop()).toBe(4);
    expect(q.isEmpty()).toBe(true);
  });

  it("converts queue to array", () => {
    const q = new Queue<number>();
    const values = [81, 16, -12, 5.5];
    values.forEach(v => q.push(v));
    expect(q.toArray()).toEqual(values);
  });

  it("fills and empties queue multiple times", () => {
    const q = new Queue<number>();
    const v = [2, 4, 8, 0];

    v.forEach(v => q.push(v));
    while (!q.isEmpty()) q.pop();

    v.forEach(v => q.push(v));
    while (!q.isEmpty()) q.pop();

    v.forEach(v => q.push(v));
    expect(q.toArray()).toEqual(v);
  });

  it("returns the correct length of the queue", () => {
    const q = new Queue<number>();
    expect(q.length()).toBe(0);
    [1, 1, 1, 1].forEach(n => q.push(n));
    expect(q.length()).toBe(4);
  });
});