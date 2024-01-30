import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const userService = inject(UserService);

    return userService.user.pipe(
        map((user: User | null) => {
            if (user) {
                router.navigate(['home']);
                return false;
            } else {
                return true;
            }
        }),
    );
};
