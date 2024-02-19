import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rateColor'
})
export class RateColorPipe implements PipeTransform {
    rgbColors: rgbColor[] = [
        { r: 226, g: 32, b: 38 }, // #e22026 // red
        { r: 245, g: 121, b: 81 }, // #f57951
        { r: 252, g: 176, b: 65 }, // #fcb041
        { r: 146, g: 202, b: 97 }, // #92ca61
        { r: 58, g: 180, b: 73 }, // #3ab449 // green
    ];

    transform(value: number, valueToCompare?: number): string {
        if (valueToCompare != null) {
            return this.compareValues(value, valueToCompare);
        } else {
            return this.colorGradient(value);
        }
    }

    private compareValues(value: number, valueToCompare: number) {
        if (value > valueToCompare) {
            const greenColor = this.rgbColors[this.rgbColors.length - 1];
            return this.colorToString(greenColor, true);
        } else {
            return 'transparent';
        }
    }

    private colorGradient(value: number) {
        let colorFadeStart: rgbColor = { r: 0, g: 0, b: 0 }; // #000000 // black
        let colorFadeEnd: rgbColor = { r: 0, g: 0, b: 0 }; // #000000 // black

        let fade = value / 5; // fade should be between 0-1
        fade = fade * (this.rgbColors.length - 1); // for many colors, we need this adjustment

        // find which interval to use and adjust the fade percentage
        for (let i = 0; i < this.rgbColors.length - 1; i++) {
            if (fade <= i + 1) {
                fade -= i;
                colorFadeStart = this.rgbColors[i];
                colorFadeEnd = this.rgbColors[i + 1];
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

        return this.colorToString(gradient);
    }

    private colorToString(color: rgbColor, isSemiTransparent = false) {
        return 'rgb(' + color.r + ',' + color.g + ',' + color.b + (isSemiTransparent ? ',0.5' : ',0.9') + ')';
    }

}

interface rgbColor {
    r: number,
    g: number,
    b: number,
}
