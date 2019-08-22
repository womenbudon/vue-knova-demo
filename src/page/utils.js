

export function offsetXYFromParent(evt, offsetParent) {
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

    const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
    const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

    return { x, y };
}
