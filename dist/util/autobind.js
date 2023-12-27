"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autobind = void 0;
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const newDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return newDescriptor;
}
exports.autobind = autobind;
//# sourceMappingURL=autobind.js.map