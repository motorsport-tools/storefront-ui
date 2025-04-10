import type { Category } from '~/graphql'
import type { Node } from '../../types'



export const transformMenuData = (categories: Category[]): Node => {

    if (!Array.isArray(categories)) {
        return { key: 'root', value: { label: '', counter: 0 }, isLeaf: true, children: [] };
    }

    return {
        key: 'root',
        value: { label: '', counter: 0 },
        isLeaf: false,
        children: categories.map(category => transformCategory(category)),
    }
}

const transformCategory = (category: Category): Node => ({
    key: category.id.toString(),
    value: {
        label: category.name,
        link: '/category' + category.slug
    },
    isLeaf: !category.childs ? false : true,
    children: (category.childs && Array.isArray(category.childs))
        ? category.childs.map(transformCategory)
        : [],
})

export const findMenuNode = (keys: string[], node: Node): Node => {
    if (keys.length > 1) {
        const [currentKey, ...restKeys] = keys;
        return findMenuNode(restKeys, node.children?.find((child) => child.key === currentKey) || node);
    } else {
        return node.children?.find((child) => child.key === keys[0]) || node;
    }
};