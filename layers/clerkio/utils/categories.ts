import type { Node as menuNode } from '#layers/header/types'

export const findCategoryNode = (nodes: menuNode[], id: string): menuNode | undefined => {
    for (const node of nodes) {
        if (node.key === id) return node
        if (node.children?.length) {
            const found = findCategoryNode(node.children, id)
            if (found) return found
        }
    }
    return undefined
}

export function findParentNode(node: menuNode[], id: string): menuNode | undefined {
    if (node.children?.some(child => child.key === id)) return node;
    for (const child of node.children ?? []) {
        const deeper = findParentNode(child, id);
        if (deeper) return deeper;
    }
    return undefined;
}

export const getCategoryLabel = (array: any, id: string) => {
    const node = findCategoryNode([array], id)
    return node ? node.value.label : id
}

export function isCategoryOrChildSelected(cat: menuNode, selected: string[]): boolean {
    if (selected.includes(cat.key)) return true
    if (!cat.children) return false
    return cat.children.some(child => isCategoryOrChildSelected(child, selected))
}