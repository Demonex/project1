import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public isDark: boolean = false;

    public onDarkModeSwitched(change: boolean) {
        this.isDark = change;
    }

    @HostBinding('class')
    get themeMode() {
        return this.isDark ? 'dark-theme' : 'light-theme';
    }


}
