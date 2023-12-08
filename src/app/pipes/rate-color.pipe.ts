import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rateColor'
})
export class RateColorPipe implements PipeTransform {

    transform(value: number): string {
        return this.colorGradient(value);
    }

    colorGradient(value: number) {
        const rgbColors: rgbColor[] = [
            { r: 226, g: 32, b: 38 }, // #e22026 // red
            { r: 245, g: 121, b: 81 }, // #f57951
            { r: 252, g: 176, b: 65 }, // #fcb041
            { r: 146, g: 202, b: 97 }, // #92ca61
            { r: 58, g: 180, b: 73 }, // #3ab449 // green
        ];

        let colorFadeStart: rgbColor = { r: 0, g: 0, b: 0 }; // #000000 // black
        let colorFadeEnd: rgbColor = { r: 0, g: 0, b: 0 }; // #000000 // black

        let fade = value / 10; // fade should be between 0-1
        fade = fade * (rgbColors.length - 1); // for many colors, we need this adjustment

        // find which interval to use and adjust the fade percentage
        for (let i = 0; i < rgbColors.length - 1; i++) {
            if (fade <= i + 1) {
                fade -= i;
                colorFadeStart = rgbColors[i];
                colorFadeEnd = rgbColors[i + 1];
                break;
            }
        }

        const diffRed = colorFadeEnd.r - colorFadeStart.r;
        const diffGreen = colorFadeEnd.g - colorFadeStart.g;
        const diffBlue = colorFadeEnd.b - colorFadeStart.b;

        const gradient = {
            r: parseInt(Math.floor(colorFadeStart.r + (diffRed * fade)).toString(), 10),
            g: parseInt(Math.floor(colorFadeStart.g + (diffGreen * fade)).toString(), 10),
            b: parseInt(Math.floor(colorFadeStart.b + (diffBlue * fade)).toString(), 10),
        };

        return 'rgb(' + gradient.r + ',' + gradient.g + ',' + gradient.b + ')';
    }

}

interface rgbColor {
    r: number,
    g: number,
    b: number,
}
