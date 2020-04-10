
class BSTTreeNode<T> {
    public left: BSTTreeNode<T>;
    public right: BSTTreeNode<T>;
    public value: T;


    constructor() {
        this.left = null;
        this.right = null;
        this.value = null;
    }
}


class BSTTree<T>{
    private root: BSTTreeNode<T>;
    private historyStack: persistanceTree<T>;

    constructor() {
        this.root = null;
        this.historyStack = new persistanceTree();
    }

    insert(value: T) {
        const node = new BSTTreeNode<T>();
        node.value = value;
        this.root = this.historyStack.insert(node);
    }


}

class persistanceTree<T> {

    private versionStack: Stack<BSTTreeNode<T>>;

    constructor() {
        this.versionStack = new Stack();
    }

    /**
     *inserts node into bst by adding a new root to version stack
     *
     * @param {BSTTreeNode<T>} newNode
     * @returns
     * @memberof persistanceTree
     */
    insert(newNode: BSTTreeNode<T>) {

        // gets the old tree
        const oldTreeRoot: BSTTreeNode<T> = this.versionStack.pop();
        this.versionStack.revert();

        // make a copy thereby creating new root
        let newTreeRoot: BSTTreeNode<T> = { ...oldTreeRoot };
        // to create new nodes in the traverse path
        let newTreeTraverser: BSTTreeNode<T> = newTreeRoot;

        // to track the tree
        let traversalPointer: BSTTreeNode<T> = oldTreeRoot;
        // to keep track of the node to which new node gets attached
        let insertionPointer: BSTTreeNode<T>;

        // stops either if tree doesn't have any nodes or the traversal has come to an end
        while (traversalPointer) {

            insertionPointer = newTreeTraverser;
            if (newNode.value < traversalPointer.value) {
                // making new copy as this path is getting affected
                newTreeTraverser.left = { ...traversalPointer.left };
                newTreeTraverser = newTreeTraverser.left;
                traversalPointer = traversalPointer.left;
            } else {
                newTreeTraverser.right = { ...traversalPointer.right };
                newTreeTraverser = newTreeTraverser.right;
                traversalPointer = traversalPointer.right;
            }
        }

        // if no elements in tree
        if (!insertionPointer) {
            newTreeRoot = newNode;
        }
        // else add either to left or right child
        else if (newNode.value < insertionPointer.value) {
            insertionPointer.left = newNode;
        }
        else {
            insertionPointer.right = newNode;
        }

        // add this new tree to version stack and return 
        this.versionStack.push(newTreeRoot);
        return newTreeRoot;

    }
}