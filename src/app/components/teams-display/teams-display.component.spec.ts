import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsDisplayComponent } from './teams-display.component';

describe('TeamsDisplayComponent', () => {
    let component: TeamsDisplayComponent;
    let fixture: ComponentFixture<TeamsDisplayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TeamsDisplayComponent]
        });
        fixture = TestBed.createComponent(TeamsDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
