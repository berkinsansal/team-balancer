import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'camelCaseToTitle'
})
export class CamelCaseToTitlePipe implements PipeTransform {

    transform(camelCaseText: string): string {
        const splitText = camelCaseText.replace(/[A-Z]/g, " $&");
        const title = splitText[0].toUpperCase() + splitText.slice(1);
        return title;
    }

}
