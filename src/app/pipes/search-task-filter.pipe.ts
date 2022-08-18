import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'searchTaskFilter'
})

export class SearchTaskFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value)return null;
      if(!args)return value;

      args = args.toLowerCase();

      return value.filter(function(data: any) {
          return JSON.stringify(data).toLowerCase().includes(args);
      });
  }

}