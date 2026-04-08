/**
 * @abstract
 * Demonstrates the Composite Pattern (Week 6).
 */
class SellableComponent {
    extractItems() {
        throw new Error('Not implemented');
    }
    calculateTotal() {
        throw new Error('Not implemented');
    }
}

class SingleItem extends SellableComponent {
    constructor(data) {
        super();
        this.data = data;
    }
    extractItems() {
        return [this.data];
    }
    calculateTotal() {
        return Number(this.data.soldPrice) || 0;
    }
}

class ComboItem extends SellableComponent {
    constructor(name) {
        super();
        this.name = name;
        this.children = [];
    }
    add(child) {
        this.children.push(child);
    }
    extractItems() {
        return this.children.flatMap(child => child.extractItems());
    }
    calculateTotal() {
        return this.children.reduce((sum, child) => sum + child.calculateTotal(), 0);
    }
}

function buildCompositeTree(itemsPayload) {
    const root = new ComboItem("ROOT");
    for (const item of itemsPayload) {
        if (item.isCombo && item.children) {
            const combo = new ComboItem(item.name);
            item.children.forEach(child => combo.add(new SingleItem(child)));
            root.add(combo);
        } else {
            root.add(new SingleItem(item));
        }
    }
    return root;
}

module.exports = { SellableComponent, SingleItem, ComboItem, buildCompositeTree };
