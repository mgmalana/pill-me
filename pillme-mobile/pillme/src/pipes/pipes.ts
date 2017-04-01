import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
    transform(value: any, args?: any[]): any[] {
        // create instance vars to store keys and final output
        let dataArr: any[] = [];

        for(let v in value){
            dataArr.push(value[v]);
        }

        // return the resulting array
        return dataArr;
    }
}
