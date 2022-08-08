import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SplashService} from '../shared/services/splash.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit {

  constructor(public router: Router, private splashService: SplashService) {
    setTimeout(() => {
      this.router.navigateByUrl('home');
      this.splashService.showSplash = false;
    }, 3000);
  }

  ngOnInit() {
  }

}
