import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'max'
})
export class MaxPipe implements PipeTransform {

    transform(numbers: number[]): number {
        return Array.isArray(numbers) ? Math.max(...numbers) : numbers;
    }

}
