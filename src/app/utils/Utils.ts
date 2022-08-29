export default class Utils {

    static convertDate(date: any) {
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      }

}