import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry, tap} from 'rxjs/operators';
import {ToastController} from '@ionic/angular';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(public toastController: ToastController) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(retry(2), tap(async (event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const status = event.body.status;
        if (status === 400) {
          const toast = await this.toastController.create({
            message: event.body.message,
            duration: 2000,
            color: 'warning',
            icon: 'warning-outline'
          });
          toast.present();
        }
      }
    }));
  }
}
