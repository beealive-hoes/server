

export default class ConversionUtils {

  private constructor() { }

  //

  private static datalongIdNames = [ 'min', 'max', 'avg', 'midday' ];

  public static datalongGetId(day: number, type: 'min' | 'max' | 'avg' | 'midday' | number): number {
    const typeint = ('string' == typeof type
      ? this.datalongIdNames.indexOf(type)
      : type as number
    );

    return (day << 2) + typeint;
  }

  public static datashortGetTimestamp(date: Date) {
    return (date.getDate() << 4) + date.getHours();
  }

}
