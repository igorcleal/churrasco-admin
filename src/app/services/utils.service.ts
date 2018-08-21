import { Injectable, EventEmitter } from '@angular/core';
import { ToastService } from 'app/services/toast.service';

@Injectable()
export class UtilsService {

    eventLoading = new EventEmitter<any>();

    constructor(private toastService: ToastService) {
    }

    addToast(options) {
        this.toastService.addToast(options);
    }

    showLoading() {
        this.eventLoading.emit(true);
    }

    hideLoading() {
        this.eventLoading.emit(false);
    }

    // convert date pro formato yyyy-mm-dd
    convertDate(date: Date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) { day = '0' + day; }

        return [year, month, day].join('-');
    }
}
