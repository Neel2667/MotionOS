import { v4 as uuidv4 } from 'uuid';

export class Node {
  public id: string;
  public parent: Node | null = null;
  public children: Node[] = [];

  constructor() {
    this.id = uuidv4();
  }

  add(child: Node) {
    if (child.parent) {
      child.parent.remove(child);
    }
    child.parent = this;
    this.children.push(child);
  }

  remove(child: Node) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
    }
  }

  // Recursive update
  update(delta: number) {
    for (const child of this.children) {
      child.update(delta);
    }
  }
}
