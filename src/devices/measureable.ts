export interface Measureable {
  measure: () => Promise<number>;
}