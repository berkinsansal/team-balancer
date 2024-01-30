import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UserService } from './services/user.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'Team Balancer';
    isBlocked: Subject<boolean> = new BehaviorSubject(false);

    constructor(private primengConfig: PrimeNGConfig,
        private userService: UserService,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
    }

    ngAfterViewInit(): void {
        this.isBlocked.next(true);
        this.cdr.detectChanges();
        this.userService.authSetup(this.isBlocked);
    }
}
