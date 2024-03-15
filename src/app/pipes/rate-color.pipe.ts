import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rateColor'
})
export class RateColorPipe implements PipeTransform {
    readonly maxSkillPoint = 10;

    transform(value: number, valueToCompare?: number): string {
        if (valueToCompare != null) {
            return this.compareValues(value, valueToCompare);
        } else {
            return this.colorGradient(value, false);
        }
    }

    private compareValues(value: number, valueToCompare: number) {
        if (value === valueToCompare) {
            return 'transparent';
        } else if (value < valueToCompare) {
            const percentageDiff = (valueToCompare - value) / value;
            if (percentageDiff < 0.1) {
                return this.colorGradient(this.maxSkillPoint / 2 + 1, true);
            } else {
                return this.colorGradient(1, true);
            }
        } else {
            return this.colorGradient(this.maxSkillPoint, true);
        }
    }

    private colorGradient(value: number, isSemiTransparent: boolean) {
        const rgbColors: rgbColor[] = [
            { r: 226, g: 32, b: 38 }, // #e22026 // red
            { r: 245, g: 121, b: 81 }, // #f57951
            { r: 252, g: 176, b: 65 }, // #fcb041
            { r: 146, g: 202, b: 97 }, // #92ca61
            { r: 58, g: 180, b: 73 }, // #3ab449 // green
        ];

        let colorFadeStart: rgbColor = { r: 0, g: 0, b: 0 }; // #000000 // black
        let colorFadeEnd: rgbColor = { r: 0, g: 0, b: 0 }; // #000000 // black

        let fade = value / this.maxSkillPoint; // fade should be between 0-1
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

        return this.colorToString(gradient, isSemiTransparent);
    }

    private colorToString(color: rgbColor, isSemiTransparent: boolean) {
        return 'rgb(' + color.r + ',' + color.g + ',' + color.b + (isSemiTransparent ? ',0.5' : ',0.9') + ')';
    }

}

interface rgbColor {
    r: number,
    g: number,
    b: number,
}
