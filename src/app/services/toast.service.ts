import { ToastData } from 'ng2-toasty';
import { ToastOptions } from 'ng2-toasty';
import { ToastyService } from 'ng2-toasty';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {

    position = 'top-right';
    title: string;
    msg: string;
    showClose = true;
    timeout = 5000;
    theme = 'bootstrap';
    type = 'default';
    closeOther = false;

    constructor(private toastyService: ToastyService) {
    }

    addToast(options) {
        if (options.closeOther) {
            this.toastyService.clearAll();
        }
        this.position = options.position ? options.position : this.position;
        const toastOptions: ToastOptions = {
            title: options.title,
            msg: options.msg,
            showClose: options.showClose ? options.showClose : this.showClose,
            timeout: options.timeout ? options.timeout : this.timeout,
            theme: options.theme ? options.theme : this.theme,
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added removed!');
            }
        };

        switch (options.type) {
            case 'default': this.toastyService.default(toastOptions); break;
            case 'info': this.toastyService.info(toastOptions); break;
            case 'success': this.toastyService.success(toastOptions); break;
            case 'wait': this.toastyService.wait(toastOptions); break;
            case 'error': this.toastyService.error(toastOptions); break;
            case 'warning': this.toastyService.warning(toastOptions); break;
        }
    }
}