import { ModalType } from "../typings/modal";

export class Modal {
    constructor(modalOptions: ModalType) {
        Object.assign(this, modalOptions);
    }
}